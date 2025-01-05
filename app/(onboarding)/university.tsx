import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';

export default function UniversityScreen() {
    const { getToken } = useAuth();
    const [university, setUniversity] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUniversity = async () => {
            try {
                const token = await getToken(); // Fetch Clerk token

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/user/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Bearer token
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
            <Text style={styles.title}>Confirm Your University</Text>
            <Text style={styles.universityText}>{university}</Text>
            <Button
                title="Next"
                onPress={() => {
                    router.push('/(onboarding)/studenthousing');
                }}
            />
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
    },
    universityText: {
        fontSize: 18,
        color: '#4CAF50',
        marginBottom: 20,
    },
});
