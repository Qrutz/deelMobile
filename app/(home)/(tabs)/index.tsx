import React, { useState, useEffect, useRef } from 'react';
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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location'; // <-- import from expo-location
import { useRouter } from 'expo-router';
import { useFetchListings } from '@/hooks/ListingHooks/useFetchListings';
import { Listing } from '@/types';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/constants/Categories';
import { haversineDistance } from '@/utils/distance';

const { width } = Dimensions.get('window');

export default function Marketplace() {
    const [searchActive, setSearchActive] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [userLat, setUserLat] = useState<number | null>(null);
    const [userLng, setUserLng] = useState<number | null>(null);

    const { data: listings, isLoading, error } = useFetchListings();
    const router = useRouter();

    // Animate glow
    const glowScale = useRef(new Animated.Value(1)).current;
    const glowOpacity = useRef(new Animated.Value(0.4)).current;

    // ----- 1) Request location on mount or first render
    useEffect(() => {
        (async () => {
            // Ask for permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                setUserLat(loc.coords.latitude);
                setUserLng(loc.coords.longitude);
            } else {
                // handle permission denied if needed
                console.log('Location permission not granted');
            }
        })();
    }, []);

    // Animate glow
    useEffect(() => {
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

    // ----- 2) Filter listings by category & search
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
        router.push('/(home)/map/Index');
    };

    return (
        <View style={styles.container}>
            {/* Minimal Header */}
            <View style={styles.header}>
                <Image
                    source={require('@/assets/logo.png')}
                    style={{ width: 60, height: 40 }}
                    resizeMode='contain'
                />

                <View style={styles.headerRight}>
                    {/* Glow Icon + Map link */}
                    <TouchableOpacity onPress={handleLightningPress} style={styles.iconButton}>
                        <View style={styles.glowIconWrapper}>
                            <Animated.View
                                style={[
                                    styles.glowCircle,
                                    {
                                        transform: [{ scale: glowScale }],
                                        opacity: glowOpacity,
                                    },
                                ]}
                            />
                            <Ionicons name="map" size={24} color="#333" />
                        </View>
                    </TouchableOpacity>

                    {/* Search icon toggles the separate search bar below */}
                    <TouchableOpacity onPress={handleSearchIconPress} style={styles.iconButton}>
                        <Ionicons name="search" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar (below header if active) */}
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

            {/* Categories Row */}
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

/** STYLES */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },

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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    iconButton: {
        marginLeft: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },

    glowIconWrapper: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowCircle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 201, 0, 0.65)',
        zIndex: -1,
    },

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

    gridContainer: {
        padding: 8,
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
        marginHorizontal: '1%',
    },
});
