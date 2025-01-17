// DealCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swap } from '@/types';

interface Listing {
    title: string;
    imageUrl?: string;
}



interface DealCardProps {
    deal: Swap;
    onPress?: () => void;     // If you want it clickable
    onPressStatus?: () => void; // If you want a quick action on the status
}

export default function DealCard({ deal, onPress }: DealCardProps) {
    const { listingA, listingB, partialCash, status, pickupTime } = deal;

    // Format partialCash label
    const cashLabel = partialCash && partialCash > 0 ? `+ ${partialCash} kr` : null;

    // Possibly color-code the card background by status
    let cardBackground = '#FFF';
    switch (status) {
        case 'accepted':
            cardBackground = '#C8E6C9'; // light green
            break;
        case 'declined':
            cardBackground = '#FFCDD2'; // light red
            break;
        case 'completed':
            cardBackground = '#D1C4E9'; // light purple
            break;
        // 'pending' or default
    }

    return (
        <TouchableOpacity
            style={[styles.cardContainer, { backgroundColor: cardBackground }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Title row or "Your item vs. Their item" */}
            <View style={styles.titleRow}>
                <Text style={styles.titleText} numberOfLines={1}>
                    {listingA.title}
                </Text>
                <Ionicons name="swap-horizontal" size={20} color="#555" />
                <Text style={styles.titleText} numberOfLines={1}>
                    {listingB.title}
                </Text>
            </View>

            {/* Images row */}
            <View style={styles.imagesRow}>
                {/* left image */}
                <Image
                    source={{ uri: listingA.ImageUrl }}
                    style={styles.itemImage}
                />

                {/* partial cash label in the middle if present */}
                {cashLabel && (
                    <Text style={styles.cashLabel}>{cashLabel}</Text>
                )}

                {/* right image */}
                <Image
                    source={{ uri: listingB.ImageUrl }}
                    style={styles.itemImage}
                />
            </View>

            {/* Pickup date & status row */}
            <View style={styles.infoRow}>
                <Text style={styles.pickupText} numberOfLines={1}>
                    Pickup: {pickupTime || 'N/A'}
                </Text>
                <Text style={styles.statusText}>{status}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 8,
        padding: 8,
        // or a slight shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        // enough height to show images nicely
        minHeight: 150,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    titleText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        maxWidth: '40%',
    },
    imagesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 6,
        resizeMode: 'cover',
        backgroundColor: '#eee',
    },
    cashLabel: {
        marginHorizontal: 4,
        fontSize: 13,
        fontWeight: '600',
        backgroundColor: '#FFF',
        paddingHorizontal: 4,
        borderRadius: 4,
        overflow: 'hidden',
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickupText: {
        fontSize: 12,
        color: '#444',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#666',
    },
});
