// MessageBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
    content: string;
    isOutgoing: boolean;
    // e.g., you could add a "timestamp" or "senderName" if needed
}

export default function MessageBubble({ content, isOutgoing }: MessageBubbleProps) {
    return (
        <View
            style={[
                styles.bubble,
                isOutgoing ? styles.outgoing : styles.incoming,
            ]}
        >
            <Text style={styles.bubbleText}>{content}</Text>
            {/* Could add a timestamp or avatar here if needed */}
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 10,
        marginVertical: 4,
    },
    outgoing: {
        alignSelf: 'flex-end',
        backgroundColor: '#ffd4e5',
    },
    incoming: {
        alignSelf: 'flex-start',
        backgroundColor: '#fce5ff',
    },
    bubbleText: {
        color: '#333',
    },
});
