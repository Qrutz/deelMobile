import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Listing } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';

export default function ProductCard({ product }: { product: Listing }) {
    const [liked, setLiked] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const handlePress = () => {
        // Pre-fetch or set listing data, then navigate
        queryClient.setQueryData(['listing', product.id], product);
        router.push(`/product/${product.id}`);
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
                    style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.5)', // dark overlay
                        borderRadius: 20,
                        padding: 6,
                    }}
                    onPress={() => setLiked(!liked)}
                >
                    <Ionicons
                        name={liked ? 'heart' : 'heart-outline'}
                        size={16}
                        color={'#FFF'} // white heart icon
                    />
                </TouchableOpacity>
            </View>

            {/* Bottom Text Area */}
            <View style={styles.bottomContainer}>
                <Text numberOfLines={1} style={styles.title}>
                    {product.title}
                </Text>
                <Text style={styles.price}>
                    {product.price === 0 ? 'FREE' : `${product.price} kr`}
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
        overflow: 'visible', // ensure nothing is clipped

        // Very large shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 12, // bigger elevation for Android

        marginBottom: 24,
        position: 'relative',
    },

    imageWrapper: {
        width: '100%',
        height: 140,
        overflow: 'hidden',
        borderTopLeftRadius: CARD_RADIUS,
        borderTopRightRadius: CARD_RADIUS,
        position: 'relative', // so the heart can be absolutely positioned
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
        color: '#4CAF50', // green for FREE or price
    },
});
