// ProductCardBubble.tsx (revised)

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProductCardBubbleProps {
    productData: {
        imageUrl?: string;
        userNote?: string;
    };
}

export default function ProductCardBubble({ productData }: ProductCardBubbleProps) {
    return (
        <View style={styles.container}>
            {productData.imageUrl && (
                <Image
                    source={{ uri: productData.imageUrl }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
            )}

            {productData.userNote && (
                <Text style={styles.noteText}>{productData.userNote}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    productImage: {
        width: '100%',
        // For a 4:3 ratio, you can do aspectRatio: 4 / 3
        // For a square, aspectRatio: 1
        // For 16:9, aspectRatio: 16 / 9, etc.
        aspectRatio: 16 / 9,
        borderRadius: 8,
        marginBottom: 8,
    },
    noteText: {
        color: '#333',
        fontSize: 15,
        lineHeight: 20,
    },
});
