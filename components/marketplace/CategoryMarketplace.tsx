import React from 'react';
import {
    View,
    FlatList,
    TextInput,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '@/components/ProductCard';
import { Listing } from '@/types';

interface CategoryMarketplaceProps {
    listings: Listing[];
    search: string;
    setSearch: (value: string) => void;
}

const CategoryMarketplace: React.FC<CategoryMarketplaceProps> = ({
    listings,
    search,
    setSearch,
}) => {
    // Filter the listings when searching
    const filteredListings = listings?.filter((item: Listing) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.categoryContainer}>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search for products..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            {/* Listings in a grid */}
            <FlatList
                data={filteredListings}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                renderItem={({ item }) => (
                    <View style={styles.gridItem}>
                        <ProductCard product={item} />
                    </View>
                )}
            />
        </View>
    );
};

export default CategoryMarketplace;

const styles = StyleSheet.create({
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
});
