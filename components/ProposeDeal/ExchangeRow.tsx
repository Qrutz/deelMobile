import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Listing } from '@/types';

interface ExchangeRowProps {
    selectedItem: Listing | null;      // The user's chosen item
    targetListing: Listing;            // The listing the user wants
    onPressChangeItem: () => void;     // Opens the item selector
    setSelectedItem: (item: Listing | null) => void;
}

export default function ExchangeRow({
    selectedItem,
    setSelectedItem,
    targetListing,
    onPressChangeItem,
}: ExchangeRowProps) {
    return (
        <View style={styles.exchangeContainer}>
            {/* Left: "Your Item" */}
            <View style={styles.productColumn}>
                <View style={styles.imageWrapper}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.touchableOverlay}
                        onPress={() => {
                            // If there's no selected item, tapping the image lets the user pick
                            if (!selectedItem) {
                                onPressChangeItem();
                            }
                        }}
                    >
                        {selectedItem ? (
                            <Image
                                source={{ uri: selectedItem.ImageUrl }}
                                style={styles.productImage}
                            />
                        ) : (
                            <View style={[styles.productImage, styles.placeholder]}>
                                <Ionicons name="help" size={40} color="#999" />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* If we have an item, show an "X" to let the user re-select */}
                    {selectedItem && (
                        <TouchableOpacity
                            style={styles.removeIconContainer}
                            onPress={() => {
                                // Clear the state
                                setSelectedItem(null);
                            }}
                        >
                            <Ionicons name="close-circle" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.labelText}>Your Item</Text>
                <Text style={styles.productName} numberOfLines={1}>
                    {selectedItem?.title || 'No item'}
                </Text>
            </View>

            {/* Swap Icon in the middle */}
            <View style={styles.swapIconContainer}>
                <Ionicons name="swap-horizontal" size={28} color="#9C27B0" />
            </View>

            {/* Right: "Wanted Item" */}
            <View style={styles.productColumn}>
                <View style={styles.imageWrapper}>
                    {targetListing.ImageUrl ? (
                        <Image
                            source={{ uri: targetListing.ImageUrl }}
                            style={styles.productImage}
                        />
                    ) : (
                        <View style={[styles.productImage, styles.placeholder]}>
                            <Ionicons name="image-outline" size={40} color="#999" />
                        </View>
                    )}
                </View>

                <Text style={styles.labelText}>Wanted Item</Text>
                <Text style={styles.productName} numberOfLines={1}>
                    {targetListing.title}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    exchangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,

        justifyContent: 'space-around',
        width: '100%',
    },
    productColumn: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: 8,
    },
    touchableOverlay: {
        // Expand the pressable area to cover the entire image
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 12,
        backgroundColor: '#eee',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeIconContainer: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        padding: 2,
        zIndex: 10,
    },
    labelText: {
        fontSize: 13,
        color: '#666',
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginTop: 2,
    },
    swapIconContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
