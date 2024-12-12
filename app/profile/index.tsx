import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function ProfilePage() {
    const { signOut } = useAuth(); // Clerk sign-out function
    const { user } = useUser(); // Clerk user object

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
                        <Ionicons name={item.icon} size={24} color="#555" />
                        <Text style={styles.settingText}>{item.name}</Text>
                        <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
                    </TouchableOpacity>
                ))}

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
    signOutButton: {
        marginTop: 20,
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
