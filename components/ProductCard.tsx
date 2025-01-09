import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Listing } from '@/types';

export default function ProductCard({ product }: { product: Listing }) {
    const [liked, setLiked] = useState(false);
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => {
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
                        resizeMode="cover"
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

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
    },
    card: {
        backgroundColor: '#FCE5FF', // Deeper pastel-lavender/pink for clearer contrast
        borderRadius: 12,
        overflow: 'hidden',
        // More pronounced shadow
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 140,
    },
    heartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 16,
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
        marginBottom: 4,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FF6F9C', // Fun pink accent
    },
});

