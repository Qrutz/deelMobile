import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { useCreateListing } from '@/hooks/ListingHooks/useCreateListing';
import { CATEGORIES, Category } from '@/constants/Categories';

// If you have an enum for categories, define them here (or adjust to your real ones)


// Some quick price suggestions
const PRICE_SUGGESTIONS = ['20', '40', '60'];

// The environment variable you used for your backend
const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export type TransactionType = 'SALE' | 'SWAP' | 'BOTH';

export default function AddListingScreen() {
    const router = useRouter();
    const { user } = useUser();           // Current logged-in user
    const [transactionType, setTransactionType] = useState<TransactionType>('SALE');

    const { mutate: createListing } = useCreateListing(); // Hook for creating the listing


    // Basic form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
    const [swapPreferences, setSwapPreferences] = useState('');


    // Show/hide the Picker
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    // Image
    const [imageUri, setImageUri] = useState<string | null>(null);

    // Location
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [locationError, setLocationError] = useState('');

    // On mount, request location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationError('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude.toString());
            setLongitude(location.coords.longitude.toString());
        })();
    }, []);

    // Price suggestion tapped
    const handlePriceSuggestion = (value: string) => {
        setPrice(value);
    };

    // Toggling category
    const handleCategoryPress = () => {
        setShowCategoryPicker(!showCategoryPicker);
    };

    // Called when user taps the placeholder or plus icon
    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // Close the screen (if used as a modal)
    const handleClose = () => {
        router.back();
    };

    // Submit the form: 
    // 1) Upload image with SAS
    // 2) Post listing
    const handleSubmit = async () => {
        if (!title || !description || !imageUri || !user?.id) {
            Alert.alert('Error', 'All fields and image are required');
            return;
        }

        try {
            // 1) Request a SAS URL from your backend
            const fileName = imageUri.split('/').pop();
            const sasResponse = await fetch(`${API_URL}/sas/generate-sas-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName }),
            });

            const { sasUrl } = await sasResponse.json();
            if (!sasUrl) {
                Alert.alert('Error', 'Failed to get SAS URL');
                return;
            }

            // 2) Upload the image to that SAS URL
            const imageBlob = await fetch(imageUri).then((res) => res.blob());
            const uploadResponse = await fetch(sasUrl, {
                method: 'PUT',
                headers: { 'x-ms-blob-type': 'BlockBlob' },
                body: imageBlob,
            });

            if (!uploadResponse.ok) {
                Alert.alert('Error', 'Image upload failed');
                return;
            }

            // The final image URL is everything before the "?"
            const finalImageUrl = sasUrl.split('?')[0];

            // 3) Submit the listing (using your react-query hook)
            createListing(
                {
                    title,
                    description,
                    price: parseFloat(price) || undefined,
                    transactionType,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    imageUrl: finalImageUrl,   // The new image URL
                    category: selectedCategory || 'OTHER',
                },
                {
                    onSuccess: () => {
                        Alert.alert('Success', 'Listing created successfully');
                        router.back(); // or router.back(), or wherever
                    },
                    onError: (err) => {
                        console.error(err);
                        Alert.alert('Error', 'Failed to create listing');
                    },
                }
            );
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 1) Custom top header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Create New Listing</Text>
                <TouchableOpacity style={styles.headerClose} onPress={handleClose}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 2) Scrollable form content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.transactionTypeRow}>
                    <TouchableOpacity
                        onPress={() => setTransactionType('SALE')}
                        style={[
                            styles.segmentButton,
                            transactionType === 'SALE' && styles.segmentButtonSelected,
                        ]}
                    >
                        <Text
                            style={[
                                styles.segmentButtonText,
                                transactionType === 'SALE' && styles.segmentButtonTextSelected,
                            ]}
                        >
                            Sale Only
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setTransactionType('SWAP')}
                        style={[
                            styles.segmentButton,
                            transactionType === 'SWAP' && styles.segmentButtonSelected,
                        ]}
                    >
                        <Text
                            style={[
                                styles.segmentButtonText,
                                transactionType === 'SWAP' && styles.segmentButtonTextSelected,
                            ]}
                        >
                            Swap Only
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setTransactionType('BOTH')}
                        style={[
                            styles.segmentButton,
                            transactionType === 'BOTH' && styles.segmentButtonSelected,
                        ]}
                    >
                        <Text
                            style={[
                                styles.segmentButtonText,
                                transactionType === 'BOTH' && styles.segmentButtonTextSelected,
                            ]}
                        >
                            Sale or Swap
                        </Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.content}>
                    {/* Title */}
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter title"
                        placeholderTextColor="#999"
                    />

                    {/* Description */}
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                        placeholderTextColor="#999"
                        multiline
                    />

                    {/* Price + suggestions */}
                    {/* Price Field (only if transactionType is 'sale' or 'both') */}
                    {(transactionType === 'SALE' || transactionType === 'BOTH') && (
                        <>
                            <Text style={styles.label}>Price</Text>
                            <TextInput
                                style={styles.input}
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholder="Enter price (kr)"
                                placeholderTextColor="#999"
                            />
                            <View style={styles.suggestionRow}>
                                {PRICE_SUGGESTIONS.map((val) => (
                                    <TouchableOpacity
                                        key={val}
                                        style={styles.suggestionButton}
                                        onPress={() => handlePriceSuggestion(val)}
                                    >
                                        <Text style={styles.suggestionText}>{val} kr</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}




                    {/* Category */}
                    <Text style={styles.label}>Category</Text>
                    {!showCategoryPicker ? (
                        <TouchableOpacity
                            style={styles.categoryButton}
                            onPress={handleCategoryPress}
                        >
                            <Text style={styles.categoryButtonText}>
                                {selectedCategory || 'Select category'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                {CATEGORIES.map((cat) => (
                                    <Picker.Item
                                        key={cat.value}
                                        label={cat.label}
                                        value={cat.value}
                                    />
                                ))}
                            </Picker>
                            {/* Done button to hide the picker */}
                            <TouchableOpacity
                                style={styles.pickerDoneButton}
                                onPress={() => setShowCategoryPicker(false)}
                            >
                                <Text style={styles.pickerDoneText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* "Willing to Swap For" (only if swap or both) */}
                    {(transactionType === 'SWAP' || transactionType === 'BOTH') && (
                        <>
                            <Text style={styles.label}>Willing to swap for...</Text>
                            <TextInput
                                style={styles.input}
                                value={swapPreferences}
                                onChangeText={setSwapPreferences}
                                placeholder="e.g. I'm looking for a guitar, camera gear..."
                                placeholderTextColor="#999"
                                multiline
                            />
                        </>
                    )}


                    {/* Image placeholder + plus icon */}
                    <Text style={styles.label}>Image</Text>
                    <View style={styles.imagePickerRow}>
                        {/* Main placeholder or chosen image */}
                        <TouchableOpacity
                            style={styles.imagePlaceholder}
                            onPress={handlePickImage}
                            activeOpacity={0.7}
                        >
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.chosenImage} />
                            ) : (
                                <Text style={styles.placeholderText}>No image</Text>
                            )}
                        </TouchableOpacity>

                        {/* A plus icon to pick or replace image */}
                        <TouchableOpacity
                            style={styles.plusIconButton}
                            onPress={handlePickImage}
                        >
                            <Ionicons name="add" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Create Listing</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ------------ Styles ------------
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Top header
    headerContainer: {
        height: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerClose: {
        position: 'absolute',
        right: 16,
    },

    scrollContent: {
        paddingBottom: 40,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    input: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        color: '#333',
    },

    // Price suggestions
    suggestionRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    suggestionButton: {
        backgroundColor: '#eee',
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    suggestionText: {
        color: '#333',
        fontWeight: '500',
    },

    // Category toggle
    categoryButton: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 12,
    },
    categoryButtonText: {
        color: '#555',
        fontSize: 15,
    },
    pickerWrapper: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 12,
    },
    picker: {
        color: '#333',
    },
    pickerItem: {
        color: '#333',
    },
    pickerDoneButton: {
        paddingVertical: 10,
        backgroundColor: '#E91E63',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        alignItems: 'center',
    },
    pickerDoneText: {
        color: '#fff',
        fontWeight: '600',
    },

    // Image placeholder row
    imagePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    placeholderText: {
        color: '#999',
        fontSize: 12,
    },
    chosenImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        resizeMode: 'cover',
    },
    plusIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Submit
    submitButton: {
        backgroundColor: '#E91E63',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    transactionTypeRow: {
        flexDirection: 'row',
        marginBottom: 12,
        justifyContent: 'space-around',
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        alignItems: 'center',
    },
    segmentButtonSelected: {
        backgroundColor: '#E91E63',
        borderColor: '#E91E63',
    },
    segmentButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    segmentButtonTextSelected: {
        color: '#fff',
    },

});
