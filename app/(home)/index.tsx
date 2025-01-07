import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Dimensions,
    ScrollView,
    Animated,
    Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFetchListings } from '@/hooks/ListingHooks/useFetchListings';
import { Listing } from '@/types';
import ProductCard from '@/components/ProductCard';

const CATEGORIES = [
    { label: 'All', icon: 'apps' },
    { label: 'Textbooks', icon: 'book' },
    { label: 'Electronics', icon: 'laptop-outline' },
    { label: 'Clothing', icon: 'shirt-outline' },
    { label: 'Sports', icon: 'basketball-outline' },
    { label: 'Music', icon: 'musical-notes-outline' },
];

const { width } = Dimensions.get('window');
const ITEM_HORIZONTAL_MARGIN = 8;
const TOTAL_HORIZONTAL_MARGIN = ITEM_HORIZONTAL_MARGIN * 2 * 2;
const cardWidth = (width - TOTAL_HORIZONTAL_MARGIN) / 2;

// Glow size (diameter)
const GLOW_SIZE = 40;

export default function Marketplace() {
    const [searchActive, setSearchActive] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const { data: listings, isLoading, error } = useFetchListings();
    const router = useRouter();

    /** Animated values for glow effect */
    const glowScale = useRef(new Animated.Value(1)).current;
    const glowOpacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        // Create a continuous glow effect by animating scale + opacity in a loop
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(glowScale, {
                        toValue: 1.6,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 0.05,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(glowScale, {
                        toValue: 1.0,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 0.4,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
    }, [glowScale, glowOpacity]);

    if (isLoading) {
        return <Text style={{ margin: 20 }}>Loading...</Text>;
    }
    if (error) {
        return <Text style={{ margin: 20 }}>Error loading listings</Text>;
    }

    // Filter listings by category and search
    const filteredListings = (listings || [])
        .filter((item: Listing) => {
            if (selectedCategory === 'All') return true;
            return item.category?.toLowerCase() === selectedCategory.toLowerCase();
        })
        .filter((item: Listing) =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );

    // Toggle the search bar
    const handleSearchIconPress = () => {
        setSearchActive(!searchActive);
    };

    // Navigate to "Proximity" page
    const handleLightningPress = () => {
        router.push('/proximity');
    };

    return (
        <View style={styles.container}>
            {/* 1) Minimal Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Marketplace</Text>
                <View style={styles.headerRight}>
                    {/* 2) Lightning Icon with Glow */}
                    <TouchableOpacity onPress={handleLightningPress} style={styles.iconButton}>
                        <View style={styles.glowIconWrapper}>
                            {/* Glow container behind the icon */}
                            <Animated.View
                                style={[
                                    styles.glowCircle,
                                    {
                                        transform: [{ scale: glowScale }],
                                        opacity: glowOpacity,
                                    },
                                ]}
                            />
                            {/* Actual icon on top */}
                            <Ionicons name="layers" size={24} color="#333" />
                        </View>
                    </TouchableOpacity>

                    {/* 3) Search icon toggles the separate search bar below */}
                    <TouchableOpacity onPress={handleSearchIconPress} style={styles.iconButton}>
                        <Ionicons name="search" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* 4) Search Bar (below header if active) */}
            {searchActive && (
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#333"
                            onPress={handleSearchIconPress}
                            style={styles.backIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            value={search}
                            onChangeText={setSearch}
                            autoFocus
                        />
                    </View>
                </View>
            )}

            {/* 5) Categories Row */}
            <View style={styles.categoriesContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryRow}
                >
                    {CATEGORIES.map((cat) => {
                        const isActive = cat.label === selectedCategory;
                        return (
                            <TouchableOpacity
                                key={cat.label}
                                style={styles.categoryItem}
                                onPress={() => setSelectedCategory(cat.label)}
                            >
                                <View
                                    style={[
                                        styles.iconCircle,
                                        isActive ? styles.iconCircleActive : {},
                                    ]}
                                >
                                    <Ionicons
                                        name={cat.icon as keyof typeof Ionicons.glyphMap}
                                        size={22}
                                        color={isActive ? '#fff' : '#333'}
                                    />
                                </View>
                                <Text
                                    style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}
                                >
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* 6) Product Grid */}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },

    /* 1) Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center', // ensure all icons align vertically center
        marginLeft: 'auto',
    },
    iconButton: {
        marginLeft: 16,          // spacing between icons
        alignItems: 'center',    // center the icon horizontally
        justifyContent: 'center',// center the icon vertically
        width: 40,               // fix width to align them consistently
        height: 40,              // fix height to align them consistently
    },

    /* 2) Glow Icon Wrapping */
    glowIconWrapper: {
        width: 40,    // same as iconButton for consistent bounding
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // no marginLeft here; it's handled by iconButton
    },
    glowCircle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 201, 0, 0.65)', // glow color
        zIndex: -1,
    },

    /* 4) Search Bar */
    searchContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ededed',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    backIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        height: 36,
    },

    /* 5) Categories */
    categoriesContainer: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        marginBottom: 8,
    },
    categoryRow: {
        paddingHorizontal: 16,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 16,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleActive: {
        backgroundColor: '#4CAF50',
    },
    categoryLabel: {
        marginTop: 4,
        fontSize: 12,
        color: '#333',
    },
    categoryLabelActive: {
        fontWeight: '700',
        color: '#4CAF50',
    },

    /* 6) Product Grid */
    gridContainer: {
        padding: 8,     // or whatever you want
        // No need to do complex width calculations here
    },
    gridItem: {
        flex: 1,        // each item takes up half of the row
        margin: 8,      // spacing around each item
        // optionally backgroundColor: '#fff', etc.
    },
});
