import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


interface Product {
    image: string;
    title: string;
    price: number;
}

export default function ProductCard({ product }: { product: Product }) {


    return (
        <div className="">product</div>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 150,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    title: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        marginTop: 5,
        fontSize: 14,
        color: '#4CAF50',
    },
});
