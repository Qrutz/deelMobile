// app/proximity.tsx (or wherever your route is)
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from '@/components/Swiper';
import { useFetchListings } from '@/hooks/ListingHooks/useFetchListings';
import { Listing } from '@/types';

export default function ProximityScreen() {
    const router = useRouter();
    const { data: listings, isLoading, error } = useFetchListings();

    if (isLoading) {
        return <Text style={{ margin: 20 }}>Loading...</Text>;
    }
    if (error) {
        return <Text style={{ margin: 20 }}>Error loading listings</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Custom header with a back button */}


            <View style={styles.swiperContainer}>
                <Swiper products={listings as Listing[]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    swiperContainer: {
        flex: 1,
        padding: 16,
    },
});
