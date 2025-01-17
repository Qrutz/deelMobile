// QRScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {
    Camera,
    CameraType,
    useCameraPermissions,
    CameraCapturedPicture,
    CameraView,
} from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;


export default function QRScannerScreen() {
    const router = useRouter();
    // If you passed some param, e.g. "dealId", you can retrieve it:
    const { dealId } = useLocalSearchParams() as { dealId?: string };

    // Manage camera permission
    const [permission, requestPermission] = useCameraPermissions();

    // Track which camera lens
    const [cameraType, setCameraType] = useState<CameraType>('back');

    // Track whether we've scanned already to avoid repeated scans
    const [scanned, setScanned] = useState(false);

    // We only want to enable scanning once we have permission
    useEffect(() => {
        // Request permission on mount if not already asked
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    // If camera permissions are still loading or denied
    if (!permission) {
        return <View style={styles.centered}><Text>Requesting camera permission...</Text></View>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.permissionText}>
                    We need your permission to use the camera.
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Toggle front/back camera if needed
    const toggleCameraType = () => {
        setCameraType((prev) =>
            prev === ('back') ? 'front' : 'back'
        );
    };

    // Handler for barcode/QR codes
    const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned) return; // prevent multiple triggers
        setScanned(true);

        // Typically, you'd parse `data` (the scanned QR string):
        console.log('Scanned data:', data);

        // Here you might call an API to finalize a deal, or check the code:
        // e.g., 
        // await fetch('/swap/confirm-scan', { method: 'PATCH', body: JSON.stringify({ code: data }) })
        // or do local logic

        await fetch(`${API_URL}/swap/${dealId}/complete`, {
            method: 'PATCH',
            body: JSON.stringify({ code: data }),
        });

        // Show a success message
        Alert.alert('Success', 'Scan successful!');
        router.back();


    };

    return (
        <View style={styles.container}>
            {/* 
        We specify barCodeScannerSettings so it only tries
        to scan certain formats (like "qr"). 
        If you want to accept all types, remove it.
      */}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing='back'
                onBarcodeScanned={
                    handleBarCodeScanned
                }
                barcodeScannerSettings={
                    {
                        barcodeTypes: ['qr'],
                    }
                }


            >
                {/* Overlays: a top bar with a "cancel" or "flip" button */}
                <View style={styles.topOverlay}>
                    <TouchableOpacity style={styles.overlayButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={styles.overlayButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.overlayButton} onPress={toggleCameraType}>
                        <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
                        <Text style={styles.overlayButtonText}>Flip</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom overlay if user wants to scan again or show instructions */}
                {scanned && (
                    <View style={styles.bottomOverlay}>
                        <TouchableOpacity
                            style={[styles.overlayButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                            onPress={() => setScanned(false)}
                        >
                            <Text style={[styles.overlayButtonText, { marginLeft: 0 }]}>
                                Scan Again
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    permissionText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 12,
    },
    permissionButton: {
        backgroundColor: '#E91E63',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
    },
    permissionButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    topOverlay: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
    },
    overlayButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    overlayButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
    },
});
