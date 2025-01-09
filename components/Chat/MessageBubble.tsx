// MessageBubble.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface MessageBubbleProps {
    content: string;        // The message text or GIF URL
    isOutgoing: boolean;    // True if currentUser is the sender
    isGif?: boolean;        // True if this content is a GIF
    avatarUrl?: string;     // Optional avatar URL
    senderName?: string;    // The sender’s display name (for incoming)
}

export default function MessageBubble({
    content,
    isOutgoing,
    isGif = false,
    avatarUrl,
    senderName,
}: MessageBubbleProps) {
    // A small helper: show name only for incoming & if we have it
    const showSenderName = (!isOutgoing && !!senderName);

    return (
        <View
            style={[
                styles.container,
                isOutgoing ? styles.containerOutgoing : styles.containerIncoming,
            ]}
        >
            {/* Avatar on the left if incoming, automatically on right if row-reverse (outgoing) */}
            {avatarUrl && (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            )}

            <View style={styles.bubbleColumn}>
                {/* 1) If it’s a GIF & incoming, place the name above or below the bubble */}
                {showSenderName && isGif && (
                    <Text style={styles.senderNameAboveGif}>{senderName}</Text>
                )}

                {/* 2) The main bubble */}
                <View
                    style={[
                        styles.bubble,
                        isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
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
                        <>
                            {/* If it’s text & incoming, optionally show the name inside or above the bubble */}
                            {showSenderName && !isGif && (
                                <Text style={styles.senderNameInside}>{senderName}</Text>
                            )}
                            <Text style={styles.bubbleText}>{content}</Text>
                        </>
                    )}
                </View>

                {/* 3) If you want the name *below* the GIF bubble instead, you could do: 
            {showSenderName && isGif && <Text style={styles.senderNameBelowGif}>{senderName}</Text>} 
            Just remove the “above” approach above and use this one.
         */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        alignItems: 'flex-end', // bubble & avatar align at bottom edge
    },
    containerOutgoing: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
    },
    containerIncoming: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    // Column for the bubble (plus optional name)
    bubbleColumn: {
        maxWidth: '75%',
    },

    // The bubble itself
    bubble: {
        borderRadius: 12,
        overflow: 'hidden', // ensures bubble corners apply to GIF edges
    },
    bubbleOutgoing: {
        backgroundColor: '#ffd4e5', // pastel pink
        borderTopRightRadius: 0,
    },
    bubbleIncoming: {
        backgroundColor: '#fce5ff', // pastel purple
        borderTopLeftRadius: 0,
    },

    // If it’s text, add some normal padding
    withPadding: {
        padding: 8,
    },
    noPadding: {
        padding: 0,
    },

    // Styles for the text bubble
    bubbleText: {
        color: '#333',
        fontSize: 15,
    },

    // Sender name “inside” the text bubble
    senderNameInside: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },

    // If you want the name above the GIF (to avoid overlap)
    senderNameAboveGif: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        // Maybe bold or different color if you prefer
    },

    // Or if you prefer placing name *below* the GIF bubble:
    senderNameBelowGif: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },

    // Avatar image
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 8,
    },

    // GIF image
    gifImage: {
        width: 200,
        height: 200,
        // No extra padding around the GIF
    },
});
