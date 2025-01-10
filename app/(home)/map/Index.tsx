import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    TouchableOpacity
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';  // If using Expo Router
import * as Location from 'expo-location';
import { useFetchListings } from '@/hooks/ListingHooks/useFetchListings';
import { Ionicons } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

/** Minimal listing interface */
interface Listing {
    id: number;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    imageUrl: string;
}

export default function AllListingsMapScreen() {
    const router = useRouter(); // For navigation with Expo Router

    // get listings from hook
    const { data: listings, isLoading: loading, isError } = useFetchListings();

    // State for user location if you want to center the map
    const [userLat, setUserLat] = useState<number | null>(null);
    const [userLon, setUserLon] = useState<number | null>(null);

    // State for listings from the server

    // Basic region fallback for the map (center of Gothenburg, for example)
    const defaultRegion = {
        latitude: 57.70,
        longitude: 11.97,
        latitudeDelta: 0.12,  // Zoomed out more to see entire city
        longitudeDelta: 0.12,
    };

    // 1) On mount, we can attempt to get the user's location (optional)
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({});
                    setUserLat(loc.coords.latitude);
                    setUserLon(loc.coords.longitude);
                }
            } catch (err) {
                console.warn('Location error:', err);
            }
        })();
    }, []);



    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#E91E63" />
                <Text>Loading listings...</Text>
            </View>
        );
    }

    // Decide map center region
    let mapRegion = defaultRegion;
    if (userLat && userLon) {
        // If you want to center on user's location or handle it differently
        mapRegion = {
            latitude: userLat,
            longitude: userLon,
            latitudeDelta: 0.12,
            longitudeDelta: 0.12,
        };
    }

    // 3) Render
    return (
        <View style={styles.container}>

            {/* -- HEADER -- */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()} // or navigation.goBack()
                >
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Mapview</Text>

                <Ionicons name='sad' size={24} color="#333" />
            </View>

            {/* -- MAP -- */}
            <MapView
                style={styles.map}
                initialRegion={mapRegion}
            >
                {listings?.map((item) => (
                    <Marker
                        key={item.id}
                        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                        onPress={() => {
                            // Navigate to product page: /product/[id]
                            // You can pass other info if needed
                            router.push(`/product/${item.id}`);
                        }}
                    >
                        {/* Custom marker with listing image */}
                        <View style={styles.markerContainer}>
                            <Image
                                source={{ uri: item.ImageUrl }}
                                style={styles.markerImage}
                            />
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Header styles
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
        backgroundColor: '#eee',
        borderRadius: 6,
        marginRight: 12,
    },
    backButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    map: {
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Marker style
    markerContainer: {
        width: 50,
        height: 50,
        borderRadius: 25, // circular
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#E91E63',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // or transparent
    },
    markerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
