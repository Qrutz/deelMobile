import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputBarProps {
    // Instead of passing an object, we just pass the text string
    onSendMessage: (text: string) => void;
}

export default function ChatInputBar({ onSendMessage }: ChatInputBarProps) {
    const [messageText, setMessageText] = useState('');

    const handleSend = () => {
        if (!messageText.trim()) return;

        // Call the parent function with just the text
        onSendMessage(messageText.trim());

        // Clear the input
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
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={20} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        backgroundColor: '#fff',
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 8,
    },
    sendButton: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
