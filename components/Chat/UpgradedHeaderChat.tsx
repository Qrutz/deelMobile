// UpgradedHeaderChat.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface UpgradedHeaderProps {
    sellerName: string;
    sellerAvatar?: string;
    onBackPress?: () => void;
    isOnline?: boolean; // e.g. "true" if your server says user is online
    location?: string;  // optional, if you want to show "Gothenburg, Sweden" etc.
}

export default function UpgradedHeaderChat({
    sellerName,
    sellerAvatar,
    onBackPress,
    isOnline = false,
    location,
}: UpgradedHeaderProps) {
    return (
        <View style={styles.header}>
            {/* Back arrow */}
            <TouchableOpacity onPress={() => (onBackPress ? onBackPress() : router.back())}>
                <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>

            {/* Avatar + Name + Status */}
            <View style={styles.headerCenter}>
                {/* If we have an avatar URL, show it; else a placeholder icon */}
                {sellerAvatar ? (
                    <Image source={{ uri: sellerAvatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person-circle" size={42} color="#ccc" />
                    </View>
                )}

                <View style={styles.textContainer}>
                    <Text style={styles.sellerName} numberOfLines={1}>
                        {sellerName}
                    </Text>
                    {/* Online status or location fallback */}
                    {isOnline ? (
                        <Text style={styles.statusOnline}>Online</Text>
                    ) : location ? (
                        <Text style={styles.statusLocation}>{location}</Text>
                    ) : (
                        <Text style={styles.statusOffline}>Offline</Text>
                    )}
                </View>
            </View>

            {/* Optionally, you can add a right-side button (like for call or info) */}
            {/* 
      <TouchableOpacity style={styles.rightButton}>
        <Ionicons name="call-outline" size={24} color="#fff" />
      </TouchableOpacity>
      */}
        </View>
    );
}

const HEADER_HEIGHT = 60;

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: '#D97FB8', // A pastel pinkish-purple from earlier examples
        // If you want a subtle border or shadow:
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        flex: 1, // let this row occupy remaining space
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#eee',
    },
    avatarPlaceholder: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
        justifyContent: 'center',
    },
    sellerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff', // White text to pop against pastel background
    },
    statusOnline: {
        fontSize: 13,
        color: '#A4C3A2', // a soft green from earlier references
    },
    statusOffline: {
        fontSize: 13,
        color: '#FDFDD4', // or a subtle pastel yellow, to indicate offline
    },
    statusLocation: {
        fontSize: 13,
        color: '#FFF',
        opacity: 0.8, // slightly transparent if you want
    },
    // optional right side button style
    rightButton: {
        padding: 6,
    },
});
