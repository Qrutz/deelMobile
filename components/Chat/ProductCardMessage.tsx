// ProductCardMessage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

interface ProductCardMessageProps {
    listingId: number;
}

interface Listing {
    id: number;
    title: string;
    price: number;
    imageUrl?: string;
}

export default function ProductCardMessage({ listingId }: ProductCardMessageProps) {
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const resp = await fetch(`https://api.example.com/listings/${listingId}`);
                const data = await resp.json();
                setListing(data);
            } catch (err) {
                console.error('Error fetching listing', err);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [listingId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!listing) {
        return <Text style={styles.errorText}>Listing not found</Text>;
    }

    return (
        <View style={styles.cardContainer}>
            {listing.imageUrl && <Image source={{ uri: listing.imageUrl }} style={styles.image} />}
            <View style={styles.info}>
                <Text style={styles.title}>{listing.title}</Text>
                <Text style={styles.price}>${listing.price}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 8 },
    errorText: { color: 'red' },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 8,
    },
    info: {},
    title: {
        fontWeight: '600',
        fontSize: 16,
    },
    price: {
        color: '#4CAF50',
    },
});
