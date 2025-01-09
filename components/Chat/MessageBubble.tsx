// MessageBubble.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface MessageBubbleProps {
    content: string;        // The message text or GIF URL
    isOutgoing: boolean;    // True if currentUser is the sender
    isGif?: boolean;        // True if this content is a GIF
    avatarUrl?: string;     // Optional avatar URL
    senderName?: string;    // For incoming/group messages
}

export default function MessageBubble({
    content,
    isOutgoing,
    isGif = false,
    avatarUrl,
    senderName,
}: MessageBubbleProps) {
    return (
        <View
            style={[
                styles.container,
                isOutgoing ? styles.containerOutgoing : styles.containerIncoming,
            ]}
        >
            {/* Avatar on the left if incoming, or on the right if row-reverse is used for outgoing */}
            {avatarUrl && (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            )}

            <View style={styles.bubbleColumn}>
                {/* Sender name (only for incoming typically) */}
                {!isOutgoing && senderName ? (
                    <Text style={styles.senderName}>{senderName}</Text>
                ) : null}

                {/* The bubble container */}
                <View
                    style={[
                        styles.bubble,
                        isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
                        // If it's a GIF, apply a different style to reduce or remove padding
                        isGif ? styles.noPadding : styles.withPadding,
                    ]}
                >
                    {isGif ? (
                        <Image
                            source={{ uri: content }}
                            style={styles.gifImage}
                            resizeMode="cover"
                        />
                    ) : (
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
    // Outgoing => row-reverse
    containerOutgoing: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
    },
    // Incoming => normal row
    containerIncoming: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    bubbleColumn: {
        maxWidth: '75%', // bubble can't be wider than 75% of screen
    },

    senderName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },

    // Base bubble style
    bubble: {
        borderRadius: 12,
        overflow: 'hidden', // if you want consistent rounding for images
    },
    bubbleOutgoing: {
        backgroundColor: '#ffd4e5', // pastel pink
        borderTopRightRadius: 0,
    },
    bubbleIncoming: {
        backgroundColor: '#fce5ff', // pastel purple
        borderTopLeftRadius: 0,
    },

    // Different padding for GIF vs. text
    withPadding: {
        padding: 8,
    },
    noPadding: {
        padding: 0,
    },

    bubbleText: {
        color: '#333',
        fontSize: 15,
    },
    gifImage: {
        width: 200,
        height: 200,
        // No padding around the image if 'noPadding' is applied
    },

    // Avatar
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 8,
    },
});
