import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from '@/components/Swiper';
import { useFetchListings } from '@/hooks/ListingHooks/useFetchListings'
import { Listing } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useUser } from '@clerk/clerk-expo';

const { width, height } = Dimensions.get('window');

export default function Marketplace() {
    const [filterMode, setFilterMode] = useState<'proximity' | 'category'>('proximity');
    const [search, setSearch] = useState('');
    const { user } = useUser();
    const { data: listings, isLoading, error } = useFetchListings();

    const toggleFilterMode = () => {
        setFilterMode(filterMode === 'proximity' ? 'category' : 'proximity');
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error loading listings</Text>;
    }


    const filteredListings = listings?.filter((item: Listing) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

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
                    <Text style={styles.filterText}>{filterMode === 'proximity' ? 'Category' : 'Proximity'}</Text>
                </TouchableOpacity>
            </View>

            {filterMode === 'proximity' ? (
                // Proximity View with Swiper
                <View style={styles.swiperContainer}>
                    <Swiper products={listings!} />
                </View>
            ) : (
                // Category View'
                <View style={styles.categoryContainer}>
                    <View style={styles.searchBarContainer}>
                        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Search for products..."
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <FlatList
                        data={filteredListings}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.gridContainer}
                        renderItem={({ item }) => (
                            <View style={styles.grid}>

                                <ProductCard product={item} />
                            </View>
                        )}
                    />
                </View>
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
    categoryContainer: {
        flex: 1,
        padding: 16,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    gridContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    gridItem: {
        flex: 1,
        margin: 10,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    gridImage: {
        width: '100%',
        height: '70%',
        borderRadius: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#333',
    },
    grid: {
        flex: 1,
        gap: 10,
        justifyContent: 'space-around',
        display: 'flex',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
});
