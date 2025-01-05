import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';

export default function ProfilePage() {
    const { signOut, getToken } = useAuth(); // Clerk auth
    const [userData, setUserData] = useState<{
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        profileImageUrl: string | null;
        balance: number;
        university: {
            id: string;
            name: string;
        }
        Studenthousing: {
            id: number;
            name: string;
            latitude: number;
            longitude: number;
            chatId: string | null;
            cityId: number;
        }
    } | null>(null);

    const [loading, setLoading] = useState(true);

    // Fetch user data from the /user/me endpoint
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await getToken();
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/user/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data); // Set user data
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={{ uri: userData?.profileImageUrl || 'https://via.placeholder.com/150' }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{userData?.name}</Text>
                <Text style={styles.subtitle}>{userData?.email}</Text>
            </View>

            {/* Balance */}
            <View style={styles.infoContainer}>
                <Ionicons name="wallet-outline" size={24} color="#4CAF50" />
                <Text style={styles.infoText}>{userData?.balance.toFixed(2)} SEK</Text>
            </View>

            {/* Campus */}
            <View style={styles.infoContainer}>
                <Ionicons name="school-outline" size={24} color="#4CAF50" />
                <Text style={styles.infoText}>{userData?.university.name}</Text>
            </View>

            {/* Building */}
            <View style={styles.infoContainer}>
                <Ionicons name="business-outline" size={24} color="#4CAF50" />
                <Text style={styles.infoText}>{userData?.Studenthousing.name}</Text>
            </View>

            {/* Sign-Out Button */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        paddingTop: 80,
        backgroundColor: '#f9f9f9',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#E8F5E9',
        borderRadius: 10,
    },
    infoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginLeft: 10,
    },
    signOutButton: {
        backgroundColor: '#f06bb7',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    signOutText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
