// UpgradedHeaderChat.tsx (just an example snippet you can adapt)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface UpgradedHeaderProps {
    sellerName: string;
    sellerAvatar?: string;
    onBackPress?: () => void;
    isOnline?: boolean; // e.g. "true" if your server says user is online
}

export default function UpgradedHeaderChat({
    sellerName,
    sellerAvatar,
    onBackPress,
    isOnline = false,
}: UpgradedHeaderProps) {
    return (
        <View style={styles.header}>
            {/* Back arrow */}
            <TouchableOpacity onPress={() => (onBackPress ? onBackPress() : router.back())}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            {/* Avatar + Name + Status */}
            <View style={styles.headerCenter}>
                {/* If we have an avatar URL, show it; else a placeholder icon */}
                {sellerAvatar ? (
                    <Image source={{ uri: sellerAvatar }} style={styles.avatar} />
                ) : (
                    <Ionicons name="person-circle" size={40} color="#ccc" style={styles.avatarPlaceholder} />
                )}

                <View style={styles.textContainer}>
                    <Text style={styles.sellerName}>{sellerName}</Text>
                    <Text style={styles.status}>{isOnline ? 'Online' : 'Last seen recently'}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFD6EC',  // Pastel header color, for example
        borderBottomWidth: 1,
        borderBottomColor: '#FFBDE0', // Slightly darker pink
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16, // space between arrow and avatar
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarPlaceholder: {
        marginRight: 8,
    },
    textContainer: {
        marginLeft: 8,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    status: {
        fontSize: 13,
        color: '#4CAF50', // green for online
    },
});
