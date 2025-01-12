import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFetchListing } from '../../../hooks/ListingHooks/useFetchListing';
import { StartChatResponse, useCreateChat } from '@/hooks/ChatHooks/useCreateChat';
import { useUser } from '@clerk/clerk-expo';

export default function ProductPage() {
    const { id } = useLocalSearchParams() as { id: string };
    const router = useRouter();
    const { user } = useUser();
    const { data: listing, isLoading, isError } = useFetchListing(id);

    // Chat creation hook
    const createChatMutation = useCreateChat();

    // State for our "Compose product message" modal
    const [showProductModal, setShowProductModal] = useState(false);
    const [userMessage, setUserMessage] = useState('');

    // 1) Open the modal when user taps "Chat with Seller"
    const handleOpenModal = () => {
        if (!user || !listing) {
            Alert.alert('Error', 'User or listing data missing.');
            return;
        }
        setShowProductModal(true);
    };

    // 2) On "Send", create chat + optionally send product card message
    const handleSendProductMessage = async () => {
        if (!user || !listing) {
            Alert.alert('Error', 'User or listing data missing.');
            return;
        }

        try {
            // Step A: Create or fetch the chat
            const result = await new Promise<StartChatResponse>((resolve, reject) => {
                createChatMutation.mutate(
                    {
                        userId1: user.id,
                        userId2: listing.user.id,
                        productData: {
                            productId: listing.id,
                            title: listing.title,
                            price: listing.price,
                            imageUrl: listing.ImageUrl,
                            userNote: userMessage,
                        },
                    },
                    {
                        onSuccess: (data) => resolve(data),
                        onError: (error) => reject(error),
                    }
                );
            });

            // Step B: push to chat screen
            router.push({
                pathname: '/chat/[id]',
                params: { id: result.chatId },
            });

            // Close the modal & clear input
            setShowProductModal(false);
            setUserMessage('');
        } catch (error) {
            console.error('Error starting chat:', error);
            Alert.alert('Error', 'Could not start chat.');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (isError || !listing) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Failed to load listing</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
        );
    }

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
                    <Text style={styles.price}>{listing.price.toFixed(0)} kr</Text>
                </View>

                <Text style={styles.description}>{listing.description}</Text>

                {/* Seller Info */}
                <TouchableOpacity
                    onPress={() => router.push(`/profile/${listing.user.id}`)}
                    style={styles.sellerContainer}
                >
                    <Image
                        source={listing.user.image}
                        style={styles.sellerImage}
                        contentFit="cover"
                    />
                    <Text style={styles.sellerName}>{listing.user.fullName}</Text>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View style={styles.buttonsContainer}>
                    {/* Propose Swap Button */}
                    <TouchableOpacity onPress={
                        () => router.push({
                            pathname: '/proposeTradeModal',
                            params: { listingId: listing.id, recipientId: listing.userId }, // pass any needed param
                        })
                    }
                        style={styles.swapButton}>
                        <Text style={styles.swapButtonText}>Propose Swap</Text>
                    </TouchableOpacity>

                    {/* Chat Button */}
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={handleOpenModal}
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

            {/* Modal for "Compose product message" */}
            <Modal
                visible={showProductModal}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Send a message about:</Text>

                        <View style={styles.productPreview}>
                            <Image
                                source={{ uri: listing.ImageUrl }}
                                style={styles.previewImage}
                            />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.previewTitle}>{listing.title}</Text>
                                <Text style={styles.previewPrice}>
                                    SEK {listing.price.toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Type a short note..."
                            value={userMessage}
                            onChangeText={setUserMessage}
                            multiline
                        />

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleSendProductMessage}
                            >
                                <Text style={styles.modalButtonText}>Send</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                                onPress={() => {
                                    setShowProductModal(false);
                                    setUserMessage('');
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ----------- STYLES -----------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7FB', // a soft pastel/pink-ish background
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
        color: '#333',
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
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 12,
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
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    detailsContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        maxWidth: '70%',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E91E63',
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        lineHeight: 22,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // New "Propose Swap" button
    swapButton: {
        flex: 1,
        backgroundColor: '#E91E63',
        paddingVertical: 15,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    swapButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    chatButton: {
        flex: 1,
        backgroundColor: '#FDE68A',
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

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    productPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    previewImage: {
        width: 60,
        height: 60,
        borderRadius: 6,
        marginRight: 10,
    },
    previewTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    previewPrice: {
        fontSize: 14,
        color: '#4CAF50',
    },
    input: {
        minHeight: 60,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
        color: '#333',
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#E91E63',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
