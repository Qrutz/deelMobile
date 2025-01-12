import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

// Example interface if your listings have "ImageUrl" and "title"
interface Listing {
    id: number;
    title: string;
    ImageUrl?: string;
}

interface SwapProposalBubbleProps {
    listingA?: Listing;
    listingB?: Listing;
    status?: string;              // "pending", "accepted", etc.
    pickupDate?: string;          // If you eventually store a real date
    isOutgoing?: boolean;         // <-- Add this prop to know if current user is the proposer
    onAcceptSwap?: () => void;    // Called when user taps "Accept"
    onDeclineSwap?: () => void;   // Called when user taps "Decline"
}

export default function SwapProposalBubble({
    listingA,
    listingB,
    status = 'pending',
    pickupDate, // optional prop if you want a real date
    isOutgoing = false, // defaults to false
    onAcceptSwap,
    onDeclineSwap,
}: SwapProposalBubbleProps) {

    // Hardcode a date/time if you don't pass `pickupDate`
    const displayDate = pickupDate || 'Pickup: Tomorrow @ 3:00PM';

    // Decide if we should show Accept/Decline or "Waiting for response"
    const showActions = status === 'pending' && !isOutgoing;
    const showWaiting = status === 'pending' && isOutgoing;

    return (
        <View style={styles.container}>
            <Text style={styles.swapHeading}>Swap Proposal</Text>

            <View style={styles.listingsRow}>
                {/* Listing A */}
                <View style={styles.listingColumn}>
                    <Text style={styles.listingTitle}>{listingA?.title || 'Listing A'}</Text>
                    {listingA?.ImageUrl ? (
                        <Image source={{ uri: listingA.ImageUrl }} style={styles.listingImage} />
                    ) : (
                        <View style={styles.placeholderBox}>
                            <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.swapSymbol}>↔</Text>

                {/* Listing B */}
                <View style={styles.listingColumn}>
                    <Text style={styles.listingTitle}>{listingB?.title || 'Listing B'}</Text>
                    {listingB?.ImageUrl ? (
                        <Image source={{ uri: listingB.ImageUrl }} style={styles.listingImage} />
                    ) : (
                        <View style={styles.placeholderBox}>
                            <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Hardcoded pickup date or pass it in as a prop */}
            <Text style={styles.pickupDate}>{displayDate}</Text>

            {/* Show the current status */}
            <Text style={styles.statusText}>Status: {status}</Text>

            {/* If “pending” and user is the recipient => show Accept/Decline */}
            {showActions && (
                <View style={styles.buttonRow}>
                    {onAcceptSwap && (
                        <TouchableOpacity style={[styles.swapButton, styles.accept]} onPress={onAcceptSwap}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    )}
                    {onDeclineSwap && (
                        <TouchableOpacity style={[styles.swapButton, styles.decline]} onPress={onDeclineSwap}>
                            <Text style={styles.buttonText}>Decline</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* If the current user is the proposer => “Waiting for response” */}
            {showWaiting && (
                <View style={styles.waitingContainer}>
                    <Text style={styles.waitingText}>Waiting for a response...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF9E6', // pale yellow or any accent color
        borderRadius: 8,
        padding: 10,
        maxWidth: 260, // tweak as needed
    },
    swapHeading: {
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 6,
    },
    listingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    listingColumn: {
        alignItems: 'center',
    },
    listingTitle: {
        fontWeight: '500',
        fontSize: 14,
        marginBottom: 4,
    },
    listingImage: {
        width: 80,
        height: 80,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
    },
    placeholderBox: {
        width: 80,
        height: 80,
        borderRadius: 6,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#666',
        fontSize: 12,
    },
    swapSymbol: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    pickupDate: {
        marginTop: 4,
        fontSize: 13,
        color: '#444',
    },
    statusText: {
        marginTop: 6,
        fontStyle: 'italic',
        fontSize: 13,
        color: '#666',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    swapButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    accept: {
        backgroundColor: '#4CAF50',
    },
    decline: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
    },
    waitingContainer: {
        marginTop: 8,
        paddingVertical: 8,
        alignItems: 'center',
    },
    waitingText: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
    },
});
