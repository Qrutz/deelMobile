import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Image } from 'expo-image';

interface SellerInfoProps {
    sellerId: string;
    sellerName: string;
    sellerImage?: string;    // Could be string | undefined
    onPress: () => void;
    style?: ViewStyle;
    imageStyle?: ImageStyle;
}

export default function SellerInfo({
    sellerId,
    sellerName,
    sellerImage,
    onPress,
    style,
    imageStyle,
}: SellerInfoProps) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.sellerContainer, style]}>
            <Image source={sellerImage} style={[styles.sellerImage, imageStyle]} contentFit="cover" />
            <Text style={styles.sellerName}>{sellerName}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    sellerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sellerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});
