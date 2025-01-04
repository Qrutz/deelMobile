import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';




export default function ProfilePage() {
    const { signOut } = useAuth();
    const { user } = useUser();

    // State for buildings and selected building
    const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // Fetch buildings from the API
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/buildings`);
                const data = await response.json();
                setBuildings(data);

                // Pre-select user's current building
                const userBuildingId = user?.unsafeMetadata.buildingId as string;
                setSelectedBuilding(userBuildingId || data[0]?.id.toString());
            } catch (error) {
                console.error('Error fetching buildings:', error);
            }
        };
        fetchBuildings();
    }, []);

    // Handle building change
    const changeBuilding = async () => {
        if (!selectedBuilding || !user?.id) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/buildings/${user?.id}/change-building`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ buildingId: selectedBuilding }),
                }
            );


            if (response.ok) {
                Alert.alert('Success', 'Building updated successfully!');
            } else {
                Alert.alert('Error', 'Failed to update building. Please try again.');
            }
        } catch (error) {
            console.error('Error changing building:', error);
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const settings = [
        { name: 'Saldo', icon: 'wallet-outline' },
        { name: 'Account', icon: 'person-circle-outline' },
        { name: 'Privacy', icon: 'shield-checkmark-outline' },
        { name: 'Notifications', icon: 'notifications-outline' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{user?.emailAddresses[0].emailAddress}</Text>
                <Text style={styles.subtitle}>Your Profile</Text>
            </View>

            {/* Settings List */}
            <View style={styles.settingsContainer}>
                {settings.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.settingItem}>
                        <Ionicons name={item.icon as any} size={24} color="#555" />
                        <Text style={styles.settingText}>{item.name}</Text>
                        <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Building Selector */}
            <Text style={styles.sectionTitle}>Change Building</Text>

            <TouchableOpacity
                style={[styles.updateButton, loading && styles.disabledButton]}
                onPress={changeBuilding}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.updateButtonText}>Update Building</Text>
                )}
            </TouchableOpacity>

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
    settingsContainer: {
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
    },
    settingText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buildingPickerContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
    },
    picker: {

    },
    updateButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        opacity: 0.6,
    },
    updateButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    signOutButton: {
        backgroundColor: '#f06bb7',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    signOutText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
