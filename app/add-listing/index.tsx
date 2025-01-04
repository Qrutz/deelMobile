import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as Location from 'expo-location';
import { useCreateListing } from '../../hooks/useCreateListing';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;


const AddListing: React.FC = () => {
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
            mediaTypes: ['images'],
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
            // Step 1: Get SAS URL
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

            // Step 2: Upload Image
            const imageBlob = await fetch(image).then(res => res.blob());
            const uploadResponse = await fetch(sasUrl, {
                method: 'PUT',
                headers: { 'x-ms-blob-type': 'BlockBlob' },
                body: imageBlob,
            });

            if (!uploadResponse.ok) {
                Alert.alert('Error', 'Image upload failed');
                return;
            }

            // Step 3: Submit Listing via useCreateListing hook
            createListing(
                {
                    title,
                    description,
                    price: parseFloat(price),
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    imageUrl: sasUrl.split('?')[0],
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
        <View style={styles.container}>
            <Text>Title:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />

            <Text>Description:</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
            />

            <Text>Price:</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="Enter price"
            />

            <Button title="Pick an Image" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}

            <Button title="Create Listing" onPress={handleSubmit} />
        </View>
    );
};

export default AddListing;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 5,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
});
