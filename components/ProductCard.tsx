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
        queryClient.setQueryData(['listing', product.id], product);
        router.push(`/product/${product.id}`);
    };

    const renderPriceOrSwapLabel = () => {
        const tType = product.transactionType;
        const priceVal = product.price || 0;
        const preferences = product.swapPreferences || '';

        if (tType === 'FREE') {
            return 'FREE';
        }
        if (tType === 'SWAP') {
            if (preferences.trim().length > 0) {
                return `SWAP: ${preferences}`;
            }
            return 'SWAP ONLY';
        }
        if (tType === 'BOTH') {
            if (priceVal > 0 && preferences.trim().length > 0) {
                return `${priceVal} kr • or swap: ${preferences}`;
            }
            if (priceVal > 0) {
                return `${priceVal} kr • or swap`;
            }
            if (preferences.trim().length > 0) {
                return `FREE • or swap: ${preferences}`;
            }
            return 'BOTH: No details';
        }

        // SALE fallback
        if (!priceVal) {
            return 'FREE';
        }
        return `${priceVal} kr`;
    };

    // A small helper to show distance in "m" if < 1km, else "X km"
    const renderDistance = () => {
        if (distanceKM === undefined) return null; // if no distance provided
        if (distanceKM < 1) {
            const meters = (distanceKM * 1000).toFixed(0);
            return `${meters}m away`;
        }
        return `${distanceKM.toFixed(1)}km away`;
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.cardContainer}
            onPress={handlePress}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: product.ImageUrl }}
                    style={styles.image}
                    contentFit="cover"
                />
                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => setLiked(!liked)}
                >
                    <Ionicons
                        name={liked ? 'heart' : 'heart-outline'}
                        size={16}
                        color="#FFF"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomContainer}>
                <Text numberOfLines={1} style={styles.title}>
                    {product.title}
                </Text>
                <Text style={styles.price}>
                    {renderPriceOrSwapLabel()}
                </Text>

                {/* Distance display if available */}
                {distanceKM !== undefined && (
                    <Text style={styles.distanceLabel}>
                        {renderDistance()}
                    </Text>
                )}
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
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 12,
        marginBottom: 24,
        position: 'relative',
    },
    imageWrapper: {
        width: '100%',
        height: 140,
        overflow: 'hidden',
        borderTopLeftRadius: CARD_RADIUS,
        borderTopRightRadius: CARD_RADIUS,
        position: 'relative',
    },
    heartButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 6,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    bottomContainer: {
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4A4A4A',
        marginBottom: 4,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4CAF50',
    },
    distanceLabel: {
        marginTop: 4,
        fontSize: 13,
        color: '#555',
        fontWeight: '600',
    },
});
