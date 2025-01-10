import { useFetchListing } from '@/hooks/ListingHooks/useFetchListing';
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

interface ChatMessage {
    id: string;
    listingId?: number;
    senderId: string;
    status?: string;
}

interface Listing {
    id: number;
    title: string;
    price: number;
    ImageUrl: string;
    ownerId: string; // The user ID who posted this item
}

interface ProductCardMessageProps {
    message: ChatMessage;
    currentUserId: string;
}

export default function ProductCardMessage({ message, currentUserId }: ProductCardMessageProps) {
    // @ts-ignore - We're not using the `status` field in this component
    const { data: listing, isLoading, isError } = useFetchListing(message.listingId);

    if (isLoading) {
        return (
            <View style={styles.cardContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!listing) {
        return (
            <View style={styles.cardContainer}>
                <Text>Listing not found.</Text>
            </View>
        );
    }

    // 1) Who owns the listing?
    const isListingOwner = listing.userId === currentUserId;

    // 2) Who sent this productCard message?
    const isMessageSender = message.senderId === currentUserId;

    // For debugging / clarity
    console.log('Listing ownerId:', listing.userId);
    console.log('Message senderId:', message.senderId);
    console.log('currentUserId:', currentUserId);
    console.log('isListingOwner:', isListingOwner);
    console.log('isMessageSender:', isMessageSender);

    return (
        <View style={styles.cardContainer}>
            <Image source={{ uri: listing.ImageUrl }} style={styles.image} />
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.price}>{listing.price} kr</Text>

            {isListingOwner ? (
                <Text style={styles.infoText}>You own this listing.</Text>
            ) : (
                <Text style={styles.infoText}>
                    Someone else owns this listing.
                </Text>
            )}

            {isMessageSender ? (
                <Text style={[styles.infoText, { color: '#555' }]}>
                    (You sent this product card)
                </Text>
            ) : (
                <Text style={[styles.infoText, { color: '#555' }]}>
                    (Another user sent this product card)
                </Text>
            )}

            {/* 
        If you want to show "I'll take it" only if you're not the listing owner,
        AND you are not the one who sent it, you could do:
        
        if (!isListingOwner && !isMessageSender) {
          // e.g. a third scenario in a group chat
          ...
        }
      */}
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFD6EC',
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        maxWidth: 250,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 4,
        marginBottom: 6,
    },
    title: {
        fontWeight: 'bold',
    },
    price: {
        color: '#4CAF50',
        marginBottom: 6,
    },
    infoText: {
        fontSize: 13,
        color: '#333',
    },
});
