import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

import { useFetchUserListings } from '@/hooks/ListingHooks/useFetchMyListings';

interface Listing {
    id: number;
    title: string;
    price: number;
    status: 'active' | 'sold';
    // Add other fields if needed
}

export default function SellerSimulationFlow() {
    const { data: fetchedListings, isLoading, isError } = useFetchUserListings();

    // We'll copy the fetched listings into local state so we can update status easily
    const [listings, setListings] = useState<Listing[]>([]);

    // For the modal
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [showQrModal, setShowQrModal] = useState(false);

    React.useEffect(() => {
        // Once fetch completes, store in local state
        if (fetchedListings && !isLoading && !isError) {
            // If your backend doesn't return "status", we can default to 'active'
            const processed = fetchedListings.map((item: any) => ({
                ...item,
                status: item.status ?? 'active',
            }));
            setListings(processed);
        }
    }, [fetchedListings, isLoading, isError]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading your listings...</Text>
            </View>
        );
    }

    if (isError || !listings) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error fetching your listings</Text>
            </View>
        );
    }

    // --- function that marks listing as sold in local state
    const markAsSold = (listingId: number) => {
        setListings(prev => {
            return prev.map(item => {
                if (item.id === listingId) {
                    return { ...item, status: 'sold' };
                }
                return item;
            });
        });
    };

    // When user taps on an item, open the QR modal
    const handleListingPress = (item: Listing) => {
        // Only show QR if it's active
        if (item.status === 'sold') {
            Alert.alert('Listing already sold');
            return;
        }
        setSelectedListing(item);
        setShowQrModal(true);
    };

    // "Simulate" scanning the code
    const onSimulateScan = () => {
        if (!selectedListing) return;
        markAsSold(selectedListing.id);
        setShowQrModal(false);
        setSelectedListing(null);
        Alert.alert('Listing Marked as Sold', 'We simulated scanning the QR code!');
    };

    // Renders each listing in the list
    const renderItem = ({ item }: { item: Listing }) => {
        return (
            <TouchableOpacity
                style={styles.listingRow}
                onPress={() => handleListingPress(item)}
            >
                <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle}>{item.title}</Text>
                    <Text style={styles.listingPrice}>{item.price} kr</Text>
                </View>
                <Text
                    style={[
                        styles.statusBadge,
                        item.status === 'sold' && styles.statusBadgeSold,
                    ]}
                >
                    {item.status.toUpperCase()}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* A simple header bar */}
            <View style={styles.headerBar}>
                <Text style={styles.headerTitle}>My Listings (WTF IS THE FLOW)</Text>
            </View>

            <FlatList
                data={listings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />

            {/* Modal for showing the QR code */}
            <Modal visible={showQrModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedListing && (
                            <>
                                <Text style={styles.modalTitle}>QR Code for {selectedListing.title}</Text>

                                <View style={{ marginVertical: 20 }}>
                                    <QRCode
                                        value={`myapp://buy/${selectedListing.id}`}
                                        size={200}
                                    />
                                </View>

                                <View style={styles.modalButtonRow}>
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        onPress={onSimulateScan}
                                    >
                                        <Text style={styles.modalButtonText}>Simulate Scan</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: '#999' }]}
                                        onPress={() => {
                                            setShowQrModal(false);
                                            setSelectedListing(null);
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7FB', // pastel pinkish background
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF7FB',
    },
    loadingText: {
        color: '#333',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#FFF7FB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    headerBar: {
        backgroundColor: '#FDE68A', // pastel yellow
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        // subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    listingRow: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        // shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 2,
    },
    listingInfo: {
        flexDirection: 'column',
        maxWidth: '70%',
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    listingPrice: {
        fontSize: 14,
        color: '#E91E63', // pink for price
    },
    statusBadge: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: '#4CAF50',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    statusBadgeSold: {
        backgroundColor: '#999',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    modalButtonRow: {
        flexDirection: 'row',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#E91E63',
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
