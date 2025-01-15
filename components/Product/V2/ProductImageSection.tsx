// ProductImageSection.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface ImageSectionProps {
    imageUrl: string;
}

export default function ProductImageSection({ imageUrl }: ImageSectionProps) {
    return (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.45,
        backgroundColor: '#ddd',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
