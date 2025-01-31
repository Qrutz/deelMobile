import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Listing } from '@/types';

type TransactionType = 'SALE' | 'SWAP' | 'BOTH' | 'FREE';

interface ProductCardProps {
    product: Listing;
    distanceKM?: number; // optional distance in km
}

export default function ProductCard({ product, distanceKM }: ProductCardProps) {
    const [liked, setLiked] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const handlePress = () => {
        // Preload data in the query cache for smoother transitions
        queryClient.setQueryData(['listing', product.id], product);
        router.push(`/product/${product.id}`);
    };

    const tType = product.transactionType as TransactionType;
    const priceVal = product.price || 0;
    const preferences = product.swapPreferences || '';

    // 1) Price / Swap / Free label
    function renderPriceOrSwapLabel() {
        if (tType === 'FREE') {
            return 'FREE';
        }
        if (tType === 'SWAP') {
            if (preferences.trim().length > 0) {
                return `Swap: ${preferences}`;
            }
            return 'SWAP ONLY';
        }
        if (tType === 'BOTH') {
            if (priceVal > 0 && preferences.trim().length > 0) {
                return `${priceVal} kr or Swap: ${preferences}`;
            }
            if (priceVal > 0) {
                return `${priceVal} kr or Swap`;
            }
            if (preferences.trim().length > 0) {
                return `FREE or Swap: ${preferences}`;
            }
            return 'BOTH: No details';
        }
        // SALE fallback
        if (!priceVal) {
            return 'FREE';
        }
        return `${priceVal} kr`;
    }

    // 2) Distance label
    function renderDistance() {
        if (distanceKM === undefined) return null;
        let distanceText = '';
        if (distanceKM < 1) {
            distanceText = `${Math.round(distanceKM * 1000)}m away`;
        } else {
            distanceText = `${distanceKM.toFixed(1)}km away`;
        }
        return (
            <View style={styles.distanceRow}>
                <Ionicons name="location-outline" size={14} color="#4CAF50" />
                <Text style={styles.distanceText}>{distanceText}</Text>
            </View>
        );
    }

    // 3) Show a label chip if FREE or SWAP/BOTH
    const showChip = tType === 'FREE' || tType === 'SWAP' || tType === 'BOTH';

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer} onPress={handlePress}>
            <View style={styles.imageWrapper}>

                {/* Optional Chip for FREE/SWAP deals */}
                {showChip && (
                    <View style={styles.labelChip}>
                        <Text style={styles.labelChipText}>
                            {tType === 'FREE' ? 'FREE' : tType === 'SWAP' ? 'SWAP' : 'SALE / SWAP'}
                        </Text>
                    </View>
                )}

                <Image
                    source={{ uri: product.ImageUrl }}
                    style={styles.image}
                    contentFit="cover"
                />
                {/* Heart icon in bottom-right corner of image */}
                <TouchableOpacity style={styles.heartButton} onPress={() => setLiked(!liked)}>
                    <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                {/* Title */}
                <Text numberOfLines={1} style={styles.title}>
                    {product.title}
                </Text>

                {/* Price / Swap / etc. */}
                <Text style={styles.priceLabel}>{renderPriceOrSwapLabel()}</Text>

                {/* Distance display */}
                {distanceKM !== undefined && renderDistance()}
            </View>
        </TouchableOpacity>
    );
}

const CARD_RADIUS = 12;

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
        // Elevation / shadow (Android + iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    imageWrapper: {
        width: '100%',
        height: 140,
        position: 'relative',
        backgroundColor: '#eee',
    },
    image: {
        width: '100%',
        height: '100%',
    },

    // FREE / SWAP Chip
    labelChip: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FF9800', // or '#4CAF50'
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
        zIndex: 2,
    },
    labelChipText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },

    // Heart Icon
    heartButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        padding: 6,
        zIndex: 3,
    },

    bottomContainer: {
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A4A4A',
        marginBottom: 4,
    },

    // Price / Swap label
    priceLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4CAF50',
    },

    // Distance row
    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    distanceText: {
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
    },
});
