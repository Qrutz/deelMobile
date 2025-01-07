import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from '@/components/Swiper';
import { useFetchListings } from '@/hooks/ListingHooks/useFetchListings';
import { Listing } from '@/types';
import { useUser } from '@clerk/clerk-expo';

// Import the new category-based component
import CategoryMarketplace from '@/components/marketplace/CategoryMarketplace';

const { width, height } = Dimensions.get('window');

export default function Marketplace() {
    const [filterMode, setFilterMode] = useState<'proximity' | 'category'>('proximity');
    const [search, setSearch] = useState('');
    const { user } = useUser();
    const { data: listings, isLoading, error } = useFetchListings();

    const toggleFilterMode = () => {
        setFilterMode((prevMode) =>
            prevMode === 'proximity' ? 'category' : 'proximity'
        );
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error loading listings</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.headerTitle}>👋 Hi {user?.firstName}!</Text>
                    <Text style={styles.headerSubtitle}>
                        {filterMode === 'proximity' ? 'Proximity Deals' : 'Category Listings'}
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleFilterMode} style={styles.filterToggle}>
                    <Ionicons name="options-outline" size={16} color="black" />
                    <Text style={styles.filterText}>
                        {filterMode === 'proximity' ? 'Category' : 'Proximity'}
                    </Text>
                </TouchableOpacity>
            </View>

            {filterMode === 'proximity' ? (
                // Proximity View with Swiper
                <View style={styles.swiperContainer}>
                    <Swiper products={listings!} />
                </View>
            ) : (
                // Category View in a separate component
                <CategoryMarketplace
                    listings={listings!}
                    search={search}
                    setSearch={setSearch}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        padding: 8,
        borderRadius: 8,
    },
    filterText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    swiperContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});
