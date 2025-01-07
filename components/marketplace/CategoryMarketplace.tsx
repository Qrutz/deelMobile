// CategoryMarketplace.tsx
import React from 'react';
import {
    View,
    FlatList,
    TextInput,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '@/components/ProductCard';
import { Listing } from '@/types';

interface CategoryMarketplaceProps {
    listings: Listing[];
    search: string;
    setSearch: (value: string) => void;
}

const { width } = Dimensions.get('window');
// A bit of math to control item width for 2 columns
// so they don't get cut off or have weird spacing
const ITEM_HORIZONTAL_MARGIN = 8;
const TOTAL_HORIZONTAL_MARGIN = ITEM_HORIZONTAL_MARGIN * 2 * 2; // 2 items, each with left/right margin
const cardWidth = (width - TOTAL_HORIZONTAL_MARGIN) / 2;

const CategoryMarketplace: React.FC<CategoryMarketplaceProps> = ({
    listings,
    search,
    setSearch,
}) => {
    const filteredListings = listings?.filter((item: Listing) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
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

            {/* 2-Column Grid */}
            <FlatList
                data={filteredListings}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                renderItem={({ item }) => (
                    <View style={[styles.gridItem, { width: cardWidth }]}>
                        <ProductCard product={item} />
                    </View>
                )}
            />
        </View>
    );
};

export default CategoryMarketplace;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 16,
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
        paddingVertical: 10,
    },
    gridItem: {
        marginHorizontal: ITEM_HORIZONTAL_MARGIN,
        marginBottom: 16,
        // no fixed height: let ProductCard define its own size
    },
});
