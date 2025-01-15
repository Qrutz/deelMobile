import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

interface Listing {
    id: number;
    title: string;
    ImageUrl?: string;
}

interface SwapProposalBubbleProps {
    listingA?: Listing;
    listingB?: Listing;
    status?: string;               // "pending", "accepted", "declined", etc.
    partialCash?: number;          // e.g. 50
    pickupDate?: string;           // e.g. "Tomorrow @ 3:00PM"
    note?: string;                 // e.g. "I'll add 50 kr because..."
    isOutgoing?: boolean;          // true if current user is the proposer
    onAcceptSwap?: () => void;     // Called on "Accept"
    onDeclineSwap?: () => void;    // Called on "Decline"
}

export default function SwapProposalBubble({
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

    // Fall back if no pickupDate
    const displayDate = pickupDate || 'Pickup: Tomorrow @ 3:00PM';

    // Optional partial cash label
    const cashLabel = partialCash && partialCash > 0 ? `+ ${partialCash} kr` : null;

    // Show Accept/Decline if I'm the recipient and status == pending
    const showActions = (status === 'pending') && !isOutgoing;
    // Show "Waiting" if I'm the proposer and status == pending
    const showWaiting = (status === 'pending') && isOutgoing;

    function renderNote() {
        if (!note) return null;
        return <Text style={styles.noteText}>Note: {note}</Text>;
    }

    // Dynamically choose bubble background based on status
    let containerStyle: any[] = [styles.container];
    switch (status) {
        case 'accepted':
            containerStyle.push({ backgroundColor: '#A5D6A7' }); // light green pastel
            break;
        case 'declined':
            containerStyle.push({ backgroundColor: '#EF9A9A' }); // light red pastel
            break;
        case 'pending':
        default:
            containerStyle.push({ backgroundColor: '#FFF8E1' }); // warm pastel yellow
            break;
    }

    return (
        <View style={containerStyle}>
            {/* Heading */}
            <Text style={styles.heading}>DEAL PROPOSAL</Text>

            {/* The row that shows listing A vs listing B */}
            <View style={styles.row}>
                {/* Listing A */}
                <View style={styles.column}>
                    <Text style={styles.listingTitle}>{listingA?.title || 'Listing A'}</Text>
                    {listingA?.ImageUrl ? (
                        <Image source={{ uri: listingA.ImageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                    )}
                </View>

                {/* Middle area: arrows, partialCash, etc. */}
                <View style={styles.middleArea}>
                    <Text style={styles.swapSymbol}>↔</Text>
                    {cashLabel && <Text style={styles.cashLabel}>{cashLabel}</Text>}
                </View>

                {/* Listing B */}
                <View style={styles.column}>
                    <Text style={styles.listingTitle}>{listingB?.title || 'Listing B'}</Text>
                    {listingB?.ImageUrl ? (
                        <Image source={{ uri: listingB.ImageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Optional note from the proposer */}
            {renderNote()}

            {/* Pickup date/time */}
            <Text style={styles.pickupDate}>{displayDate}</Text>

            {/* Status text */}
            <Text style={styles.status}>Status: {status}</Text>

            {/* Accept/Decline or waiting message */}
            {showActions && (
                <View style={styles.buttonsRow}>
                    {onAcceptSwap && (
                        <TouchableOpacity style={[styles.button, styles.acceptBtn]} onPress={onAcceptSwap}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    )}
                    {onDeclineSwap && (
                        <TouchableOpacity style={[styles.button, styles.declineBtn]} onPress={onDeclineSwap}>
                            <Text style={styles.buttonText}>Decline</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {showWaiting && (
                <View style={styles.waitingBox}>
                    <Text style={styles.waitingText}>Waiting for a response...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 12,
        maxWidth: 280,

        // small shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    heading: {
        fontSize: 18,        // bigger
        fontWeight: '900',   // extra bold
        color: '#333',       // darker text
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 1,    // optional spacing for a bolder look
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    column: {
        alignItems: 'center',
        width: 80, // match image size
    },
    listingTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
        textAlign: 'center',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    placeholder: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 12,
        color: '#666',
    },
    middleArea: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    swapSymbol: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    cashLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
        backgroundColor: '#FFECB3', // pale yellow for partial cash
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 2,
    },
    noteText: {
        fontStyle: 'italic',
        fontSize: 13,
        color: '#555',
        marginBottom: 6,
    },
    pickupDate: {
        marginTop: 4,
        fontSize: 13,
        color: '#444',
    },
    status: {
        fontSize: 13,
        fontStyle: 'italic',
        color: '#666',
        marginTop: 4,
    },
    buttonsRow: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    acceptBtn: {
        backgroundColor: '#4CAF50',
    },
    declineBtn: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    waitingBox: {
        marginTop: 10,
        alignItems: 'center',
    },
    waitingText: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
    },
});
