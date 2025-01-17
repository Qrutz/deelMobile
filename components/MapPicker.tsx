// MapPickerModal.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
} from 'react-native';
import MapView, {
    Marker,
    Circle,
    MapPressEvent,
} from 'react-native-maps';
import * as Location from 'expo-location'; // if you want device location

interface MapPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onLocationSelected: (lat: number, lng: number) => void;

    // The listing's location, so we can show it as a reference
    listingLat?: number | null;
    listingLng?: number | null;

    // If you want to start the user-chosen marker at some lat/lng
    initialLat?: number | null;
    initialLng?: number | null;
}

// A small helper to compute approximate distance in KM
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function MapPickerModal({
    visible,
    onClose,
    onLocationSelected,

    listingLat = null,
    listingLng = null,
    initialLat = null,
    initialLng = null,
}: MapPickerModalProps) {
    // If you want to auto-locate the user:
    const [userLat, setUserLat] = useState<number | null>(null);
    const [userLng, setUserLng] = useState<number | null>(null);

    // The chosen pickup spot
    const [markerLat, setMarkerLat] = useState<number>(initialLat || 37.78825);
    const [markerLng, setMarkerLng] = useState<number>(initialLng || -122.4324);

    // Start region
    const [mapRegion, setMapRegion] = useState({
        latitude: markerLat,
        longitude: markerLng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

    // If you want device location as a fallback or to center map
    useEffect(() => {
        (async () => {
            // Request permission if you haven't
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let loc = await Location.getCurrentPositionAsync({});
                setUserLat(loc.coords.latitude);
                setUserLng(loc.coords.longitude);
            }
        })();
    }, []);

    // If listingLat/listingLng are provided, you might center the map around it
    useEffect(() => {
        if (listingLat && listingLng) {
            setMapRegion((prev) => ({
                ...prev,
                latitude: listingLat,
                longitude: listingLng,
            }));
            // Could also set marker to listing or not, up to you
        }
    }, [listingLat, listingLng]);

    // Called when user taps on map
    const handleMapPress = (e: MapPressEvent) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setMarkerLat(latitude);
        setMarkerLng(longitude);
    };

    // Compute distance from listing location to chosen marker
    let distanceKm: number | null = null;
    if (listingLat && listingLng && markerLat && markerLng) {
        distanceKm = haversineDistance(listingLat, listingLng, markerLat, markerLng);
    }

    return (
        <Modal animationType="slide" transparent={false} visible={visible}>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    region={mapRegion}
                    onRegionChangeComplete={(region) => setMapRegion(region)}
                    onPress={handleMapPress}
                >
                    {/* If we want to show listing's location as a reference */}
                    {listingLat && listingLng && (
                        <Marker
                            coordinate={{ latitude: listingLat, longitude: listingLng }}
                            pinColor="blue"
                            title="Listing Location"
                            description="Seller's item location"
                        />
                    )}

                    {/* The user's chosen pickup marker */}
                    <Marker
                        coordinate={{ latitude: markerLat, longitude: markerLng }}
                        draggable // let user drag to refine
                        onDragEnd={(e) => {
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            setMarkerLat(latitude);
                            setMarkerLng(longitude);
                        }}
                        pinColor="red"
                        title="Pickup Spot"
                    />

                    {/* Possibly show circle or user location if desired */}
                    {userLat && userLng && (
                        <Marker
                            coordinate={{ latitude: userLat, longitude: userLng }}
                            pinColor="green"
                            title="My Location"
                        />
                    )}
                </MapView>

                {/* Info box at top or bottom */}
                <View style={styles.infoBox}>
                    {distanceKm ? (
                        <Text style={styles.infoText}>
                            Pickup is {distanceKm.toFixed(2)} km from listing location
                        </Text>
                    ) : (
                        <Text style={styles.infoText}>
                            Tap or drag to choose a pickup spot
                        </Text>
                    )}
                </View>

                {/* Footer with confirm/cancel */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => onLocationSelected(markerLat, markerLng)}
                    >
                        <Text style={styles.confirmButtonText}>Confirm Location</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    infoBox: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 8,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    footer: {
        backgroundColor: '#fff',
        padding: 16,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    closeButton: {
        backgroundColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#333',
        fontWeight: '700',
    },
});
