// ChatInputBar.tsx

import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputBarProps {
    onSendMessage: (text: string) => void;
}

export default function ChatInputBar({ onSendMessage }: ChatInputBarProps) {
    const [messageText, setMessageText] = useState('');

    const handleSend = () => {
        if (!messageText.trim()) return;
        onSendMessage(messageText.trim());
        setMessageText('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ---------- Styles -----------
const styles = StyleSheet.create({
    container: {
        borderTopWidth: 0,
        backgroundColor: '#FFD6EC', // Pastel pink for the entire input row area
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: Platform.select({ ios: 20, android: 12 }),
        // Extra bottom padding for iOS "safe area"
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        marginRight: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E91E63',  // Vibrant pink for send button
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#E91E63',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
});
