import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import ProductCardBubble from './ProductCardBubble';
import SwapProposalBubble from './SwapProposalBubble';

interface MessageBubbleProps {
    type: 'text' | 'gif' | 'productCard' | 'swapProposal';
    content?: string;
    productData?: any;

    // Add this prop for swap proposals
    swapData?: {
        listingA?: { id: number; title: string };
        listingB?: { id: number; title: string };
        status?: string; // "pending" | "accepted" etc.
        partialCash?: number; // Optional partial cash offer
        note?: string;
        // You could add more fields if needed
    };

    isOutgoing: boolean;
    senderName?: string;
    avatarUrl?: string;

    // Optionally accept/decline callbacks
    onAcceptSwap?: () => void;
    onDeclineSwap?: () => void;
}

export default function MessageBubble({
    type,
    content,
    productData,
    swapData,
    isOutgoing,
    senderName,
    avatarUrl,
    onAcceptSwap,
    onDeclineSwap,
}: MessageBubbleProps) {
    // We'll remove the avatar if it's isOutgoing
    const shouldShowAvatar = !isOutgoing && !!avatarUrl;

    // Adjust bubble styles
    const bubbleStyles = [
        styles.bubble,
        isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
        // If it's a GIF, remove the normal padding
        type === 'gif' && styles.gifNoPadding,
        type === 'swapProposal' && { padding: 0 }, // Remove padding for SwapProposal
    ];

    return (
        <View
            style={[
                styles.container,
                isOutgoing ? styles.containerOutgoing : styles.containerIncoming,
            ]}
        >
            {/* Only show avatar if it's an incoming message */}
            {shouldShowAvatar && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}

            <View style={styles.bubbleColumn}>
                {/* Sender name for incoming messages only */}
                {!isOutgoing && senderName && (
                    <Text style={styles.senderName}>{senderName}</Text>
                )}

                <View style={bubbleStyles}>
                    {/* 1) Product Card */}
                    {type === 'productCard' && productData ? (
                        <ProductCardBubble productData={productData} />

                    ) : /* 2) GIF */
                        type === 'gif' && content ? (
                            <Image
                                source={{ uri: content }}
                                style={styles.gifImage}
                                contentFit='cover'
                            />

                        ) : /* 3) Swap Proposal */
                            type === 'swapProposal' && swapData ? (
                                <SwapProposalBubble
                                    listingA={swapData.listingA}
                                    listingB={swapData.listingB}
                                    status={swapData.status}
                                    onAcceptSwap={onAcceptSwap}
                                    onDeclineSwap={onDeclineSwap}
                                    isOutgoing={isOutgoing}
                                    note={swapData.note}
                                    partialCash={swapData.partialCash}

                                />

                            ) : (
                                /* 4) Default text message */
                                <Text style={styles.bubbleText}>{content}</Text>
                            )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        alignItems: 'flex-end',
    },
    containerOutgoing: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
    },
    containerIncoming: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    bubbleColumn: {
        maxWidth: '75%',
    },
    senderName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },

    // Base bubble styling (with default padding)
    bubble: {
        borderRadius: 12,
        padding: 8,
    },
    bubbleOutgoing: {
        backgroundColor: '#ffd4e5', // pastel pink
        borderTopRightRadius: 0,
    },
    bubbleIncoming: {
        backgroundColor: '#fce5ff', // pastel purple
        borderTopLeftRadius: 0,
    },
    bubbleText: {
        color: '#333',
        fontSize: 15,
    },

    // If we want no padding for GIF
    gifNoPadding: {
        padding: 0,
    },
    gifImage: {
        width: 200,
        height: 200,
        borderRadius: 6,
    },

    // Avatar styling
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 8,
    },
});
