// DibsMessage.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface ChatMessage {
    id: string;
    listingId?: number;
    senderId: string;  // the buyer who called dibs
    status?: 'pending' | 'accepted' | 'declined';
    content: string;
}

interface Listing {
    id: number;
    ownerId: string;
    title: string;
    price: number;
    // ...
}

interface DibsMessageProps {
    message: ChatMessage;
    currentUserId: string;   // so we know if we're the listing owner
    onAccept: (msgId: string) => void;
    onDecline: (msgId: string) => void;
}

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export default function DibsMessage({
    message,
    currentUserId,
    onAccept,
    onDecline,
}: DibsMessageProps) {
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchListing() {
            if (!message.listingId) {
                setLoading(false);
                return;
            }
            try {
                const resp = await fetch(`${API_URL}/listings/${message.listingId}`);
                if (!resp.ok) throw new Error('Failed to fetch listing for dibs');
                const data = await resp.json();
                setListing(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchListing();
    }, [message.listingId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!listing) {
        return (
            <View style={[styles.container, styles.fallback]}>
                <Text>Item data missing. Possibly removed.</Text>
            </View>
        );
    }

    const isOwner = listing.ownerId === currentUserId;
    const dibStatus = message.status || 'pending';

    if (dibStatus === 'pending') {
        if (isOwner) {
            return (
                <View style={[styles.container, styles.pending]}>
                    <Text style={styles.text}>
                        Buyer {message.senderId} called dibs on {listing.title}!
                    </Text>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(message.id)}>
                            <Text>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.declineBtn} onPress={() => onDecline(message.id)}>
                            <Text>Decline</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={[styles.container, styles.pending]}>
                    <Text style={styles.text}>
                        Waiting for the listing owner to accept/decline...
                    </Text>
                </View>
            );
        }
    } else if (dibStatus === 'accepted') {
        return (
            <View style={[styles.container, styles.accepted]}>
                <Text style={styles.text}>Dibs accepted! You got {listing.title}.</Text>
            </View>
        );
    } else if (dibStatus === 'declined') {
        return (
            <View style={[styles.container, styles.declined]}>
                <Text style={styles.text}>Dibs declined by the listing owner.</Text>
            </View>
        );
    } else {
        return (
            <View style={[styles.container, styles.fallback]}>
                <Text style={styles.text}>Unknown dibs status...</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 250,
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
    },
    text: {
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        marginTop: 6,
    },
    pending: {
        backgroundColor: '#fff3cd',
    },
    accepted: {
        backgroundColor: '#d4edda',
    },
    declined: {
        backgroundColor: '#f8d7da',
    },
    fallback: {
        backgroundColor: '#ccc',
    },
    acceptBtn: {
        backgroundColor: '#c8e6c9',
        borderRadius: 4,
        marginRight: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    declineBtn: {
        backgroundColor: '#f8bbd0',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
});
