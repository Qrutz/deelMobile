// ProductPicker.tsx
import { useAuth } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;


// Example "Listing" shape
interface Listing {
    id: number;
    title: string;
    price: number;
    ImageUrl: string;
    // etc.
}

interface ProductPickerProps {
    onSelectListing: (listingId: number) => void;
    sellerUserId: string;
    onCancel: () => void;
}

export default function ProductPicker({
    onSelectListing,
    onCancel,
    sellerUserId,
}: ProductPickerProps) {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth(); // Clerk getToken hook

    useEffect(() => {
        async function fetchListings() {
            const token = await getToken();
            if (!token) {
                throw new Error('Authentication token missing');
            }

            try {
                // Suppose "sellerUserId" is passed as a prop or you have it from context

                const resp = await fetch(
                    `${API_URL}/listings/active?userId=${sellerUserId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Add the Bearer token
                    }
                }
                );
                if (!resp.ok) throw new Error('Failed to fetch listings');
                const data = await resp.json();
                setListings(data); // store in state
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchListings();
    }, [sellerUserId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Pick a Product</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text>Cancel</Text>
            </TouchableOpacity>

            <FlatList
                data={listings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => onSelectListing(item.id)}
                    >
                        <Image
                            source={{ uri: item.ImageUrl }}
                            style={{ width: 100, height: 100 }}
                        />
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.price}>{item.price} $</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cancelButton: {
        position: 'absolute',
        top: 40,
        right: 16,
        padding: 8,
        backgroundColor: '#f4f4f4',
        borderRadius: 6,
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 14,
        marginVertical: 6,
        borderRadius: 8,
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
    },
    price: {
        marginTop: 2,
        color: '#666',
    },
});
function getToken() {
    throw new Error('Function not implemented.');
}

