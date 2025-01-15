import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProductHeaderProps {
    title: string;
    priceLabel: string;
}

export default function ProductHeader({ title, priceLabel }: ProductHeaderProps) {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>{priceLabel}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        maxWidth: '70%',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E91E63',
    },
});
