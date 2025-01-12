import { router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

/** 
 * Replace "any" with your real Listing type if you have it.
 * 
 * interface Listing {
 *   id: string;
 *   userId: string;
 *   transactionType: 'SWAP' | 'SALE' | 'BOTH';
 *   ...
 * }
 */

interface BuyerActionsProps {
    listing: any; // or your Listing type
    priceLabel: string;
    handleOpenModal: () => void;
    createChatMutationPending: boolean;
}

export default function BuyerActions({
    listing,
    priceLabel,
    handleOpenModal,
    createChatMutationPending,
}: BuyerActionsProps) {
    const showSwap = listing.transactionType === 'SWAP' || listing.transactionType === 'BOTH';

    const handleProposeSwap = () => {
        // Navigate to your proposeTradeModal
        console.log('Propose swap or route to proposeTradeModal with listing info');
        // e.g.
        router.push({ pathname: '/proposeTradeModal', params: { listingId: listing.id, recipientId: listing.userId } });
    };

    return (
        <View style={styles.buttonsContainer}>
            {showSwap && (
                <TouchableOpacity onPress={handleProposeSwap} style={styles.swapButton}>
                    <Text style={styles.swapButtonText}>Propose Swap</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.chatButton}
                onPress={handleOpenModal}
                disabled={createChatMutationPending}
            >
                {createChatMutationPending ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <Text style={styles.chatButtonText}>Chat with the seller</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
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
});
