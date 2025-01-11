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
    return (
        <TouchableOpacity
            onPress={() => {

                // Navigate to product pageQ
                queryClient.setQueryData(['listing', product.id], product);

                router.push(`/product/${product.id}`);
            }}
            activeOpacity={0.9} // a little less transparency on press
            style={styles.cardContainer}
        >
            <View style={styles.card}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.ImageUrl }}
                        style={styles.image}
                        contentFit='cover'

                    />
                    {/* Heart Button */}
                    <TouchableOpacity
                        style={styles.heartButton}
                        onPress={() => setLiked(!liked)}
                    >
                        <Ionicons
                            name={liked ? 'heart' : 'heart-outline'}
                            size={18}
                            color={liked ? '#FF4A4A' : '#333'} // e.g. red if liked
                        />
                    </TouchableOpacity>
                </View>

                {/* Title & Price */}
                <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={styles.title}>
                        {product.title}
                    </Text>
                    <Text style={styles.price}>{product.price} kr</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// Just replace your styling with this snippet

// ProductCard.tsx (only the relevant styles to achieve the design)
const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
    },
    card: {
        backgroundColor: '#FCE5FF', // Pastel-lavender background
        borderRadius: 12,
        overflow: 'hidden',
        // Subtle shadow
        shadowColor: '#000',   // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,         // Android shadow
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 140,
        resizeMode: 'cover', // ensure the image covers the container
    },
    heartButton: {
        position: 'absolute',
        top: 105,
        right: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: 6,
    },
    textContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4A4A4A',
        marginBottom: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FF6F9C', // Pink accent for price
    },
});
