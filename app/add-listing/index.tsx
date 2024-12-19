import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

const AddListing: React.FC = () => {
    const router = useRouter();
    const { user } = useUser();
    const [image, setImage] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [locationError, setLocationError] = useState('');

    const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || '';

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
            setImage(result.assets[0].uri); // Adjusted for Expo's updated API
        }
    };

    const createListing = async () => {
        try {
            if (!title || !description || !price || !latitude || !longitude || !image) {
                Alert.alert('Error', 'All fields are required');
                return;
            }

            if (!latitude || !longitude) {
                Alert.alert('Error', 'Could not retrieve your location');
                return;
            }


            // if no user id, give an error
            if (!user?.id) {
                Alert.alert('Error', 'User not found');
                return;
            }

            // Step 1: Get SAS URL
            const fileName = image.split('/').pop();
            const sasResponse = await fetch(`${API_BASE_URL}/generate-sas-url`, {
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

            // Step 3: Submit Listing

            const createResponse = await fetch(`${API_BASE_URL}/listings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    price: parseFloat(price),
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    userId: user.id,
                    imageUrl: sasUrl.split('?')[0], // Remove the SAS token from the URL
                }),
            });

            if (createResponse.ok) {
                Alert.alert('Success', 'Listing created successfully');
                router.push('/'); // Navigate back to the homepage or another route
            } else {
                Alert.alert('Error', 'Failed to create listing');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Title:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
            />

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

            <Button title="Create Listing" onPress={createListing} />
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
