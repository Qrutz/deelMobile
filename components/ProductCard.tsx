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

const styles = StyleSheet.create({
    cardContainer: {
        // We handle outer margin in CategoryMarketplace gridItem
        // So let's not add extra margin here
        width: '100%',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        // Shadow can be subtle in a grid
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 140, // You can tweak this as needed

    },
    heartButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 12,
        padding: 6,
    },
    textContainer: {
        padding: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});
