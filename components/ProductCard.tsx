import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Listing } from '@/types';

// Extend your TransactionType as needed
type TransactionType = 'SALE' | 'SWAP' | 'BOTH' | 'FREE';

export default function ProductCard({ product }: { product: Listing }) {
    const [liked, setLiked] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const handlePress = () => {
        // Pre-fetch or set listing data, then navigate
        queryClient.setQueryData(['listing', product.id], product);
        router.push(`/product/${product.id}`);
    };

    /** 
     * Decide what to render in the "price / type" area.
     * If it's a swap, we may show "SWAP: looking for guitar," etc.
     * If it's both, we might show the price + “or swap.”
     */
    const renderPriceOrSwapLabel = () => {
        const tType = product.transactionType;
        const priceVal = product.price || 0; // fallback if undefined
        const preferences = product.swapPreferences || ''; // e.g. "camera gear"

        // 1) FREE
        if (tType === 'FREE') {
            return 'FREE';
        }

        // 2) SWAP
        if (tType === 'SWAP') {
            // If the seller specified preferences
            if (preferences.trim().length > 0) {
                return `SWAP: ${preferences}`;
            }
            return 'SWAP ONLY';
        }

        // 3) BOTH (Sale + Swap)
        if (tType === 'BOTH') {
            // If we have a price + a preference, show both
            if (priceVal > 0 && preferences.trim().length > 0) {
                return `${priceVal} kr • or swap: ${preferences}`;
            }
            // If we have just a price
            if (priceVal > 0) {
                return `${priceVal} kr • or swap`;
            }
            // If the price is 0 but preferences exist
            if (preferences.trim().length > 0) {
                return `FREE • or swap: ${preferences}`;
            }
            // fallback
            return 'BOTH: No details';
        }

        // 4) SALE
        // If price is 0 or undefined for some reason, default to FREE
        if (!priceVal) {
            return 'FREE';
        } else {
            return `${priceVal} kr`;
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.cardContainer}
            onPress={handlePress}
        >
            {/* Product Image + Heart in bottom-right of the image */}
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: product.ImageUrl }}
                    style={styles.image}
                    contentFit="cover"
                />

                {/* Heart Button over bottom-right of the image */}
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

            {/* Bottom Text Area */}
            <View style={styles.bottomContainer}>
                <Text numberOfLines={1} style={styles.title}>
                    {product.title}
                </Text>
                <Text style={styles.price}>
                    {renderPriceOrSwapLabel()}
                </Text>
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

        // Shadow
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
});
