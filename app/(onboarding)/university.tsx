import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function UniversityScreen() {
    const { getToken } = useAuth();
    const [university, setUniversity] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch university data
    useEffect(() => {
        const fetchUniversity = async () => {
            try {
                const token = await getToken(); // Fetch Clerk token

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/user/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, // Bearer token
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                if (userData.university) {
                    setUniversity(userData.university.name); // Fetch from DB
                } else {
                    setUniversity('Unknown University');
                }
            } catch (error) {
                console.error('Error fetching university:', error);
                Alert.alert('Error', 'Could not fetch university data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUniversity();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Lottie Animation */}
            {Platform.OS !== 'web' && (
                <LottieView
                    source={require('@/assets/lottie/graduationcap.json')} // Replace with your animation path
                    autoPlay
                    loop
                    style={styles.animation}
                />
            )}

            {/* Title and University Name */}
            <Text style={styles.title}>Is this your university?</Text>
            <Text style={styles.universityText}>{university}</Text>
            <Text style={styles.description}>
                Please confirm that this is the correct university associated with your account.
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <Button
                    title="Yes, this is correct"
                    onPress={() => {
                        router.push('/(onboarding)/studenthousing');
                    }}
                    color="#4CAF50"
                />
                <Button
                    title="No, this is wrong"
                    onPress={() => {
                        Alert.alert('Contact Support', 'Please contact support to correct your university.');
                    }}
                    color="#F44336"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    universityText: {
        fontSize: 22,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    animation: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 10,
    },
});
