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
// or distance buttons if you prefer
// import { ScrollView } from 'react-native';

export default function OnboardingLocationScreen() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
        null
    );
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // radius in meters, default 1000 (1km)
    const [radius, setRadius] = useState(1000);

    // For the map region
    const [mapRegion, setMapRegion] = useState<Region>({
        latitude: 37.78825, // some default
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    useEffect(() => {
        (async () => {
            // 1) Request location permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // 2) Get current position
            let current = await Location.getCurrentPositionAsync({});
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

    // If location perms denied or something else went wrong
    if (errorMsg) {
        return (
            <View style={styles.centered}>
                <Ionicons name="location-outline" size={40} color="#999" />
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                        setErrorMsg(null);
                        // Trigger re-check or navigate to a fallback
                    }}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // The user can confirm the chosen radius
    const handleConfirm = () => {
        // 3) Save or store in user profile
        // For demonstration, just an alert
        Alert.alert(
            'Radius Selected',
            `You chose ${radius} meters. We'll show listings within ~${Math.round(
                radius / 1000
            )} km.`
        );
        // Then navigate to the next onboarding step
        // e.g. navigation.navigate('OnboardingDone');
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

            {/* If you prefer buttons:
        <ScrollView horizontal style={{ marginBottom: 20 }}>
          {[500, 1000, 2000, 3000].map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.distanceButton,
                radius === val && styles.distanceButtonSelected,
              ]}
              onPress={() => setRadius(val)}
            >
              <Text style={styles.distanceButtonText}>
                {formatRadiusLabel(val)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView> 
      */}

            {/* Using a slider for dynamic radius selection */}
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
        backgroundColor: '#FFF8E1', // a warm pastel yellow for that playful vibe
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
        backgroundColor: '#F06292', // pinkish
        borderRadius: 6,
    },
    retryText: {
        color: '#fff',
        fontWeight: '700',
    },

    // If using horizontal distance buttons:
    distanceButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#FFE0B2',
        borderRadius: 20,
        marginRight: 8,
    },
    distanceButtonSelected: {
        backgroundColor: '#F57C00', // orange accent
    },
    distanceButtonText: {
        color: '#333',
        fontWeight: '600',
    },
});
