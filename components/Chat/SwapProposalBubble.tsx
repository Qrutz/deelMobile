import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import dayjs from 'dayjs';
import { router } from 'expo-router';

interface Listing {
    id: number;
    title: string;
    ImageUrl?: string;
}

interface SwapProposalBubbleProps {
    id: string;
    listingA?: Listing;
    listingB?: Listing;
    status?: string;           // "pending", "accepted", "declined", etc.
    partialCash?: number;      // e.g. 50
    pickupDate?: Date;         // e.g. new Date()
    note?: string;             // "I'll add 50 kr..."
    isOutgoing?: boolean;      // if current user is the proposer
    onAcceptSwap?: () => void;
    onDeclineSwap?: () => void;
}

export default function SwapProposalBubble({
    id,
    listingA,
    listingB,
    status = 'pending',
    partialCash,
    pickupDate,
    note,
    isOutgoing = false,
    onAcceptSwap,
    onDeclineSwap,
}: SwapProposalBubbleProps) {

    // Format pickup date/time if present:
    const displayDate = pickupDate
        ? dayjs(pickupDate).format('ddd, MMM D [at] h:mm A')
        : 'No pickup time set';

    // If partialCash is > 0, show something like "+ 50 kr"
    const cashLabel = partialCash && partialCash > 0 ? `+ ${partialCash} kr` : null;

    // Decide if we show Accept/Decline or “Waiting…”
    const showActions = (status === 'pending') && !isOutgoing;
    const showWaiting = (status === 'pending') && isOutgoing;

    // If we have a user note
    const renderNote = () => {
        if (!note) return null;
        return <Text style={styles.noteText}>“{note}”</Text>;
    };

    // Container background color depends on status
    let containerStyle: any[] = [styles.container];
    let statusColor = '#333'; // default text color for "Status:"

    switch (status) {
        case 'accepted':
            containerStyle.push({ backgroundColor: '#C8E6C9' });  // soft green
            statusColor = '#2E7D32'; // darker green for text
            break;
        case 'rejected':
            containerStyle.push({ backgroundColor: '#FFCDD2' });  // soft red
            statusColor = '#B71C1C'; // darker red
            break;
        case 'pending':
        default:
            containerStyle.push({ backgroundColor: '#FCE4EC' });  // soft pink
            statusColor = '#333';
            break;
    }

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={
            () => router.push(`/deal/${id}`)
        }>
            <View style={containerStyle}>
                {/* Title Row (Swap Offer) */}
                {/* <Text style={styles.offerTitle}>Swap Offer</Text> */}

                {/* Items Row */}
                <View style={styles.itemsRow}>
                    {/* Left Item (Listing A) */}
                    <View style={styles.itemColumn}>
                        <Text style={styles.itemTitle}>{listingA?.title || 'Item A'}</Text>
                        {listingA?.ImageUrl ? (
                            <Image source={{ uri: listingA.ImageUrl }} style={styles.itemImage} />
                        ) : (
                            <View style={styles.itemPlaceholder}>
                                <Text style={styles.placeholderText}>No Image</Text>
                            </View>
                        )}
                    </View>

                    {/* Middle area: ↔ and optional partial cash */}
                    <View style={styles.middleContainer}>
                        <Text style={styles.swapIcon}>↔</Text>
                        {cashLabel && (
                            <Text style={styles.cashLabel}>{cashLabel}</Text>
                        )}
                    </View>

                    {/* Right Item (Listing B) */}
                    <View style={styles.itemColumn}>
                        <Text style={styles.itemTitle}>{listingB?.title || 'Item B'}</Text>
                        {listingB?.ImageUrl ? (
                            <Image source={{ uri: listingB.ImageUrl }} style={styles.itemImage} />
                        ) : (
                            <View style={styles.itemPlaceholder}>
                                <Text style={styles.placeholderText}>No Image</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Optional Note */}
                {renderNote()}

                {/* Pickup Time */}
                <Text style={styles.pickupLabel}>
                    Pickup: <Text style={styles.pickupValue}>{displayDate}</Text>
                </Text>

                {/* Status */}
                <Text style={[styles.statusLabel, { color: statusColor }]}>
                    Status: {status}
                </Text>

                {/* If pending and I'm the recipient => Accept/Decline */}
                {showActions && (
                    <View style={styles.actionButtons}>
                        {onAcceptSwap && (
                            <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={onAcceptSwap}>
                                <Text style={styles.actionButtonText}>Accept</Text>
                            </TouchableOpacity>
                        )}
                        {onDeclineSwap && (
                            <TouchableOpacity style={[styles.actionButton, styles.declineButton]} onPress={onDeclineSwap}>
                                <Text style={styles.actionButtonText}>Decline</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* If I'm the proposer => Waiting for a response... */}
                {showWaiting && (
                    <View style={styles.waitingContainer}>
                        <Text style={styles.waitingText}>Waiting for response...</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

/* ---------------- STYLES ---------------- */



const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 12,
        maxWidth: 300,

        // light shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 2,
    },
    offerTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
        color: '#333',
    },
    itemsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemColumn: {
        alignItems: 'center',
        width: 80,
    },
    itemTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    itemPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 12,
        color: '#666',
    },
    middleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    swapIcon: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    cashLabel: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        backgroundColor: '#FFF',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    noteText: {
        marginTop: 6,
        fontSize: 13,
        fontStyle: 'italic',
        color: '#555',
    },
    pickupLabel: {
        marginTop: 6,
        fontSize: 13,
        color: '#333',
        fontWeight: '600',
    },
    pickupValue: {
        fontWeight: '400',
        color: '#444',
    },
    statusLabel: {
        marginTop: 4,
        fontSize: 13,
        fontWeight: '700',
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        borderRadius: 6,
        paddingVertical: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
    },
    declineButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    waitingContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    waitingText: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
    },
});
