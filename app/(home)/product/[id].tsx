import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFetchListing } from '../../../hooks/ListingHooks/useFetchListing';
import { useCreateChat } from '@/hooks/ChatHooks/useCreateChat';
import { useUser } from '@clerk/clerk-expo';


export default function ProductPage() {
    const { id } = useLocalSearchParams() as { id: string };
    const router = useRouter();
    const { user } = useUser(); // Current logged-in user
    const { data: listing, isLoading, isError } = useFetchListing(id);

    // Use the chat creation hook
    const createChatMutation = useCreateChat();

    // Start or fetch chat
    const startChat = async () => {
        if (!user || !listing) {
            Alert.alert('Error', 'User or listing data missing.');
            return;
        }

        createChatMutation.mutate(
            {
                userId1: user.id, // Current user ID
                userId2: listing.user.id, // Listing owner's ID
            },
            {
                onSuccess: (chat) => {
                    // Navigate to the chatroom with the chat ID
                    router.push(`/chat/${chat.id}`);
                },
                onError: () => {
                    Alert.alert('Error', 'Could not start chat. Please try again later.');
                },
            }
        );
    };


    // Loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Error state
    if (isError || !listing) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Failed to load listing</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
        );
    }

    // Render Product Page
    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: listing.ImageUrl }} style={styles.image} />
                {/* Heart Button */}
                <TouchableOpacity style={styles.heartButton}>
                    <Ionicons name="heart-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Product Details */}
            <View style={styles.detailsContainer}>
                {/* Title and Price */}
                <View style={styles.header}>
                    <Text style={styles.title}>{listing.title}</Text>
                    <Text style={styles.price}>${listing.price.toFixed(2)}</Text>
                </View>

                <Text style={styles.description}>{listing.description}</Text>

                {/* Seller Info */}
                <View style={styles.sellerContainer}>
                    <Image source={{ uri: listing.user.image }} style={styles.sellerImage} />
                    <Text style={styles.sellerName}>{listing.user.fullName}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.buyButton}>
                        <Text style={styles.buyButtonText}>Buy now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={startChat}
                        disabled={createChatMutation.isPending}
                    >
                        {createChatMutation.isPending ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <Text style={styles.chatButtonText}>Chat with the seller</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // All previous styles
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
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
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});
