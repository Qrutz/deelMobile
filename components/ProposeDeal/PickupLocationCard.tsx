import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PickupLocationCardProps {
    pickupLat?: number | null;
    pickupLng?: number | null;
    onPress: () => void;
}

export function PickupLocationCard({
    pickupLat,
    pickupLng,
    onPress,
}: PickupLocationCardProps) {
    const hasLocation = pickupLat != null && pickupLng != null;

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.iconContainer}>
                <Ionicons name="location-sharp" size={24} color="#fff" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Pickup Location</Text>
                <Text style={styles.subtitle}>
                    {hasLocation
                        ? `Lat: ${pickupLat?.toFixed(3)}, Lng: ${pickupLng?.toFixed(3)}`
                        : 'Tap to choose a meeting spot'}
                </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#888" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,

        // small shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E91E63',  // A bright accent
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        color: '#666',
    },
});
