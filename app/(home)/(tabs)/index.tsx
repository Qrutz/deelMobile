import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';


import ProductCard from '@/components/ProductCard';
import { useFetchProximityListings } from '@/hooks/ListingHooks/useFetchListings';
import { haversineDistance } from '@/utils/distance';
import { Listing } from '@/types';
import { CATEGORIES } from '@/constants/Categories';
import SearchBar from '@/components/Marketplace/Searchbar';
import MarketplaceHeader from '@/components/Marketplace/MarketplaceHeader';
import CategoryRow from '@/components/Marketplace/CategoryRow';

export default function MarketplaceScreen() {
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [userLat, setUserLat] = useState<number | undefined>(undefined);
    const [userLng, setUserLng] = useState<number | undefined>(undefined);

    const { data: listings, isLoading, error } = useFetchProximityListings(userLat, userLng);
    const router = useRouter();

    // ---- 1) Request location on mount
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                setUserLat(loc.coords.latitude);
                setUserLng(loc.coords.longitude);
            } else {
                console.log('Location permission not granted');
            }
        })();
    }, []);

    // ---- 2) Filter listings by category & search
    const filteredListings = (listings || [])
        .filter((item: Listing) => {
            if (selectedCategory === 'All') return true;
            return item.category?.toLowerCase() === selectedCategory.toLowerCase();
        })
        .filter((item: Listing) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // ---- Handlers
    const handleToggleSearch = () => {
        setSearchActive((prev) => !prev);
    };
    const handleLightningPress = () => {
        router.push('/(home)/map/Index');
    };
    const handleCategorySelect = (cat: string) => {
        setSelectedCategory(cat);
    };

    if (isLoading) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }
    if (error) {
        return <Text style={styles.loadingText}>Error loading listings</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <MarketplaceHeader
                onSearchIconPress={handleToggleSearch}
                onLightningPress={handleLightningPress}
            />

            {/* Search Bar (below header if active) */}
            <SearchBar
                visible={searchActive}
                onBackPress={handleToggleSearch}
                query={searchQuery}
                onChangeQuery={setSearchQuery}
            />

            {/* Category Row */}
            <CategoryRow
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onCategoryPress={handleCategorySelect}
            />

            {/* Product Grid */}
            <FlatList
                data={filteredListings}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                renderItem={({ item }) => {
                    // If we have user lat/lng, calculate distance
                    let distanceKM: number | undefined;
                    if (userLat != null && userLng != null) {
                        distanceKM = haversineDistance(
                            userLat,
                            userLng,
                            item.latitude,
                            item.longitude
                        );
                    }
                    return (
                        <View style={styles.gridItem}>
                            <ProductCard product={item} distanceKM={distanceKM} />
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    loadingText: {
        margin: 20,
        textAlign: 'center',
    },
    gridContainer: {
        padding: 8,
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
        marginHorizontal: '1%',
    },
});
