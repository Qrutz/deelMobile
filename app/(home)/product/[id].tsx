import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,

} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFetchListing } from '../../../hooks/ListingHooks/useFetchListing';
import { StartChatResponse, useCreateChat } from '@/hooks/ChatHooks/useCreateChat';
import { useUser } from '@clerk/clerk-expo';
import ComposeMessageModal from '@/components/Product/ComposeMessageModal';
import BackButton from '@/components/Product/BackButton';
import BuyerActions from '@/components/Product/BuyerActions';
import OwnerActions from '@/components/Product/OwnerActions';
import ProductHeader from '@/components/Product/ProductHeader';
import ProductImageSection from '@/components/Product/ProductImageSection';
import SellerInfo from '@/components/Product/SellerInfo';

export default function ProductPage() {
    /** ROUTING, USER, and LISTING HOOKS **/
    const { id } = useLocalSearchParams() as { id: string };
    const router = useRouter();
    const { user } = useUser();
    const { data: listing, isLoading, isError } = useFetchListing(id);
    const createChatMutation = useCreateChat();

    /** MODAL STATE (FOR COMPOSING A MESSAGE) **/
    const [showProductModal, setShowProductModal] = useState(false);
    const [userMessage, setUserMessage] = useState('');

    /** CONDITIONAL HELPERS **/

    // 1) Renders a nice text for the price or "Swap Only"
    const renderPriceLabel = useCallback(() => {
        if (!listing) return '';
        switch (listing.transactionType) {
            case 'SWAP':
                return 'Swap Only';
            case 'SALE':
            case 'BOTH':
            default:
                // If listing.price is null or 0, handle gracefully
                return `${listing.price?.toFixed(0) || 0} kr`;
        }
    }, [listing]);

    // 2) Determines if the current user is the listing owner
    const isListingOwner = user?.id === listing?.user.id;

    /** HANDLERS **/

    // Called when user taps "Chat with Seller" button
    const handleOpenModal = useCallback(() => {
        if (!user || !listing) {
            Alert.alert('Error', 'User or listing data missing.');
            return;
        }
        setShowProductModal(true);
    }, [user, listing]);

    // Actually sends the product message (creates a chat)
    const handleSendProductMessage = useCallback(async () => {
        if (!user || !listing) {
            Alert.alert('Error', 'User or listing data missing.');
            return;
        }

        try {
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

            // On success, navigate to chat screen
            router.push({
                pathname: '/chat/[id]',
                params: { id: result.chatId },
            });

            // Close modal & reset input
            setShowProductModal(false);
            setUserMessage('');
        } catch (error) {
            console.error('Error starting chat:', error);
            Alert.alert('Error', 'Could not start chat.');
        }
    }, [user, listing, userMessage, createChatMutation, router]);

    /** LOADING / ERROR STATES **/
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

    /** RENDER **/
    return (
        <View style={styles.container}>
            <BackButton onPress={() => router.back()} />

            <ProductImageSection imageUrl={listing.ImageUrl} />

            <View style={styles.detailsContainer}>
                <ProductHeader
                    title={listing.title}
                    priceLabel={renderPriceLabel()}
                />

                <Text style={styles.description}>{listing.description}</Text>

                <SellerInfo
                    sellerId={listing.user.id}
                    sellerName={listing.user.fullName}
                    sellerImage={listing.user.image}
                    onPress={() => router.push(`/profile/${listing.user.id}`)}
                />

                {isListingOwner ? (
                    /** If current user owns the listing, render "edit" or "delete" or whatever **/
                    <OwnerActions />
                ) : (
                    /** Otherwise, show the "buy / swap / chat" actions **/
                    <BuyerActions
                        listing={listing}
                        priceLabel={renderPriceLabel()}
                        handleOpenModal={handleOpenModal}
                        createChatMutationPending={createChatMutation.isPending}
                    />
                )}
            </View>

            {/* MODAL for composing a product message */}
            <ComposeMessageModal
                visible={showProductModal}
                onClose={() => {
                    setShowProductModal(false);
                    setUserMessage('');
                }}
                listingTitle={listing.title}
                listingImage={listing.ImageUrl}
                listingPrice={renderPriceLabel()}
                userMessage={userMessage}
                setUserMessage={setUserMessage}
                onSend={handleSendProductMessage}
            />
        </View>
    );
}

/**
 * -------------- STYLES --------------
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7FB', // a soft pastel/pink-ish background
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    detailsContainer: {
        padding: 20,
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
    },
});
