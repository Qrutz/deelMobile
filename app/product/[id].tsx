import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProductPage() {
    const params = useLocalSearchParams();
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRamqFPV71D-ou9Hsg8554KxE_SNKG9UHZjrg&s',
                    }}
                    style={styles.image}
                />
                {/* Heart Button */}
                <TouchableOpacity style={styles.heartButton}>
                    <Ionicons name="heart-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Product Details */}
            <View style={styles.detailsContainer}>
                {/* Title and Price */}
                <View style={styles.header}>
                    <Text style={styles.title}>{params.title || 'Product Title'}</Text>
                    <Text style={styles.price}>${params.price || '0'}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.buyButton}>
                        <Text style={styles.buyButtonText}>Buy now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chatButton}>
                        <Text style={styles.chatButtonText}>Chat with the seller</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    imageContainer: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 300,
    },
    heartButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    detailsContainer: {
        flex: 1,
        padding: 20,
    },
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
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buyButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatButton: {
        flex: 1,
        backgroundColor: '#fdf488',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    chatButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
