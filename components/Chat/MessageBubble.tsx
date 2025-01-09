import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface MessageBubbleProps {
    content: string;       // The message text
    isOutgoing: boolean;   // True if currentUser is the sender
    senderName: string;    // The sender's name (if needed)
    avatarUrl?: string;    // Optional avatar URL
}

export default function MessageBubble({
    content,
    isOutgoing,
    senderName,
    avatarUrl,
}: MessageBubbleProps) {
    return (
        <View
            style={[
                styles.container,
                isOutgoing ? styles.containerOutgoing : styles.containerIncoming,
            ]}
        >
            {/* Avatar on the left for incoming, on the right for outgoing */}
            {!isOutgoing && avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : null}

            <View style={styles.bubbleColumn}>
                {/* If you only want name for group or incoming, adapt condition here */}
                {!isOutgoing && (
                    <Text style={styles.senderName}>{senderName}</Text>
                )}

                {/* The bubble itself */}
                <View
                    style={[
                        styles.bubble,
                        isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
                    ]}
                >
                    <Text style={styles.bubbleText}>{content}</Text>
                </View>
            </View>

            {isOutgoing && avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Provide some vertical spacing
        marginVertical: 4,
        alignItems: 'flex-end', // Align items at the bottom for consistent avatar/bubble alignment
    },
    // If it's outgoing, we want to reverse row so bubble + avatar go to the right
    containerOutgoing: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        // Because row-reverse automatically pushes main content to the left
        // so the bubble will appear on the right side visually
    },
    containerIncoming: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    // The column that holds the sender name + bubble
    bubbleColumn: {
        maxWidth: '80%',
    },

    // Optional sender name label (usually for incoming messages or group)
    senderName: {
        color: '#666',
        fontSize: 12,
        marginBottom: 2,
    },

    // The actual bubble
    bubble: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        // We'll let the container handle left/right alignment
    },
    bubbleOutgoing: {
        backgroundColor: '#ffd4e5',
        alignSelf: 'flex-end', // Ensures bubble is on the right column
    },
    bubbleIncoming: {
        backgroundColor: '#fce5ff',
        alignSelf: 'flex-start', // Ensures bubble is on the left column
    },
    bubbleText: {
        color: '#333',
    },

    // Avatar image
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 8,
    },
});
