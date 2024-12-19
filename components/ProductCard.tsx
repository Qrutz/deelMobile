import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Product {
    id: string;
    ImageUrl: string;
    title: string;
    price: number;
}

export default function ProductCard({ product }: { product: Product }) {
    const [liked, setLiked] = useState(false); // Track whether the product is liked
    const router = useRouter(); // Navigation hook
    return (
        <TouchableOpacity
            onPress={() => {
                router.push(`/product/${product.id}`);
            }
            }
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
                            size={20}
                            color={liked ? 'black' : 'black'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Product Title */}
                <Text style={styles.title}>{product.title}</Text>

                {/* Product Price */}
                <Text style={styles.price}>${product.price}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 10,
        padding: 10,
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 160, // Fixed height for consistent layout
        borderRadius: 12,
    },
    heartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 6,
    },
    title: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        color: '#333', // Dark gray for readability
    },
    price: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50', // Green for price
    },
});
