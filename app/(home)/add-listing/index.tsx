import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as Location from 'expo-location';
import { useCreateListing } from '../../../hooks/ListingHooks/useCreateListing';
import { Category } from '@/constants/Categories';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

const CATEGORIES = [
    { label: 'Other', value: 'OTHER' },
    { label: 'Textbooks', value: 'TEXTBOOKS' },
    { label: 'Electronics', value: 'ELECTRONICS' },
    { label: 'Clothing', value: 'CLOTHING' },
    { label: 'Sports', value: 'SPORTS' },
    { label: 'Music', value: 'MUSIC' },
];

export default function AddListing() {
    const router = useRouter();
    const { user } = useUser();
    const { mutate: createListing } = useCreateListing();

    const [image, setImage] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [locationError, setLocationError] = useState('');
    const [category, setCategory] = useState<Category>('OTHER');

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

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !price || !latitude || !longitude || !image || !user?.id) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        try {
            const fileName = image.split('/').pop();
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

            const imageBlob = await fetch(image).then((res) => res.blob());
            const uploadResponse = await fetch(sasUrl, {
                method: 'PUT',
                headers: { 'x-ms-blob-type': 'BlockBlob' },
                body: imageBlob,
            });

            if (!uploadResponse.ok) {
                Alert.alert('Error', 'Image upload failed');
                return;
            }

            createListing(
                {
                    title,
                    description,
                    price: parseFloat(price),
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    imageUrl: sasUrl.split('?')[0],
                    category,
                },
                {
                    onSuccess: () => {
                        Alert.alert('Success', 'Listing created successfully');
                        router.push('/');
                    },
                    onError: () => {
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Text style={styles.headerText}>Create New Listing</Text>

                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter title"
                        placeholderTextColor="#999"
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                        placeholderTextColor="#999"
                    />

                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        placeholder="Enter price"
                        placeholderTextColor="#999"
                    />

                    <Text style={styles.label}>Category</Text>
                    <View style={styles.debugBg}>
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue) => setCategory(itemValue)}
                            style={{
                                width: '100%',
                                color: 'black',
                                backgroundColor: 'white',
                            }}
                            itemStyle={{
                                color: 'black',
                            }}
                        >
                            {CATEGORIES.map((cat) => (
                                <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                            ))}
                        </Picker>
                    </View>

                    <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                        <Text style={styles.imageButtonText}>Pick an Image</Text>
                    </TouchableOpacity>
                    {image && <Image source={{ uri: image }} style={styles.image} />}

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Create Listing</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFD6EC',
    },
    scrollContent: {
        paddingBottom: 30, // space at bottom for content
    },
    container: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        padding: 16,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        elevation: 4,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
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
    debugBg: {
        minHeight: 48,
        marginBottom: 12,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    imageButton: {
        backgroundColor: '#FDE68A',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    imageButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 16,
    },
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
});
