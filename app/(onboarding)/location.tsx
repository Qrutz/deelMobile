import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Circle, Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router'; // to navigate

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export default function OnboardingLocationScreen() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { getToken } = useAuth(); // Clerk token
    const router = useRouter();     // expo-router
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // radius in meters, default 500m
    const [radius, setRadius] = useState(500);

    // For the map region
    const [mapRegion, setMapRegion] = useState<Region>({
        latitude: 37.78825, // default coords
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    useEffect(() => {
        (async () => {
            // 1) Request location permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // 2) Get current position
            const current = await Location.getCurrentPositionAsync({});
            const lat = current.coords.latitude;
            const lng = current.coords.longitude;

            setLocation({ lat, lng });

            setMapRegion((prev) => ({
                ...prev,
                latitude: lat,
                longitude: lng,
            }));
        })();
    }, []);

    // If location perms denied or some other error
    if (errorMsg) {
        return (
            <View style={styles.centered}>
                <Ionicons name="location-outline" size={40} color="#999" />
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                        setErrorMsg(null);
                        // Could re-request permissions or show fallback UI
                    }}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleConfirm = async () => {
        try {
            const token = await getToken();
            if (!token) {
                Alert.alert('Error', 'Missing token');
                return;
            }

            // 3) Save radius to backend
            const response = await fetch(`${API_URL}/user/radius`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ radius }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Failed to update radius');
                return;
            }

            // Success
            Alert.alert(
                'Radius Updated',
                `You chose ${radius} meters (~${(radius / 1000).toFixed(1)} km).`
            );
            // Navigate to next onboarding step or main feed
            router.push('/(onboarding)/Final'); // or '/onboardingDone', etc.
        } catch (error) {
            console.error('Error saving radius:', error);
            Alert.alert('Error', 'Something went wrong while saving your radius.');
        }
    };

    // A helper to convert radius in meters to a user-friendly label (like "2.5 km")
    function formatRadiusLabel(value: number) {
        return value < 1000
            ? `${value.toFixed(0)} m`
            : `${(value / 1000).toFixed(1)} km`;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Set Your Search Radius</Text>
            <Text style={styles.subtitle}>
                Choose how far from your location you want to see listings.
            </Text>

            {location && (
                <MapView
                    style={styles.map}
                    region={mapRegion}
                    onRegionChangeComplete={(region) => setMapRegion(region)}
                >
                    {/* Marker at user's location */}
                    <Marker
                        coordinate={{
                            latitude: location.lat,
                            longitude: location.lng,
                        }}
                        title="Your Location"
                    >
                        <Ionicons name="person" size={24} color="#6A1B9A" />
                    </Marker>

                    {/* Circle to visualize the radius */}
                    <Circle
                        center={{ latitude: location.lat, longitude: location.lng }}
                        radius={radius}
                        strokeColor="rgba(106, 27, 154, 0.6)" // a purple
                        fillColor="rgba(186, 104, 200, 0.2)"   // pastel fill
                    />
                </MapView>
            )}

            <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>{formatRadiusLabel(radius)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={500}
                    maximumValue={5000}
                    step={100}
                    value={radius}
                    onValueChange={(val) => setRadius(val)}
                    minimumTrackTintColor="#8E24AA"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#BA68C8"
                />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm Radius</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E1', // warm pastel yellow
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#4E342E',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6D4C41',
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    map: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        marginBottom: 16,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    sliderLabel: {
        width: 60,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: '600',
        color: '#4E342E',
        marginRight: 8,
    },
    slider: {
        flex: 1,
    },
    confirmButton: {
        backgroundColor: '#BA68C8', // playful pastel purple
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginTop: 10,
        fontSize: 14,
        color: '#888',
    },
    retryButton: {
        marginTop: 14,
        padding: 12,
        backgroundColor: '#F06292',
        borderRadius: 6,
    },
    retryText: {
        color: '#fff',
        fontWeight: '700',
    },
});
