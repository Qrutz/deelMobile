import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface Product {
    image: string;
    title: string;
    price: number;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <View style={styles.card}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.image} />
                <TouchableOpacity style={styles.heartButton}>
                    <Text style={styles.heartText}>❤️</Text>
                </TouchableOpacity>
            </View>

            {/* Product Title */}
            <Text style={styles.title}>{product.title}</Text>

            {/* Product Price */}
            <Text style={styles.price}>${product.price}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        marginBottom: 10,
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 12,
    },
    heartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 15,
        padding: 5,
    },
    heartText: {
        fontSize: 16,
        color: '#333',
    },
    title: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});
