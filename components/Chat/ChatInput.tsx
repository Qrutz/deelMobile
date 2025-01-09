// ChatInputBar.tsx

import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Modal,
    StyleSheet,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GifPicker from './GifPicker';

interface ChatInputBarProps {
    onSendMessage: (text: string, type: 'text' | 'gif') => void;
}

export default function ChatInputBar({ onSendMessage }: ChatInputBarProps) {
    const [messageText, setMessageText] = useState('');
    const [showGifPicker, setShowGifPicker] = useState(false);

    const handleSend = () => {
        if (!messageText.trim()) return;
        onSendMessage(messageText.trim(), 'text');
        setMessageText('');
    };

    // Called when user picks a GIF in the GifPicker
    const handleSelectGif = (gifUrl: string) => {
        onSendMessage(gifUrl, 'gif');
        setShowGifPicker(false);
    };

    return (
        <View style={styles.container}>
            <Modal
                visible={showGifPicker}
                animationType="slide"
                collapsable={true}
                presentationStyle="overFullScreen"
            >
                <View style={styles.gifPickerContainer}>
                    <GifPicker
                        onSelectGif={handleSelectGif}
                        onCancel={() => setShowGifPicker(false)}
                    />
                </View>
            </Modal>

            <View style={styles.inputRow}>
                {/* GIF Button */}
                <TouchableOpacity
                    onPress={() => setShowGifPicker(true)}
                    style={styles.gifButton}
                >
                    <Ionicons name="image" size={20} color="#333" />
                    <Text style={styles.gifButtonText}>GIF</Text>
                </TouchableOpacity>

                {/* Divider line */}
                <View style={styles.divider} />

                {/* Text Input */}
                <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                />

                {/* Send Button */}
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ------- STYLES -----------
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFD6EC',
        padding: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    gifButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gifButtonText: {
        marginLeft: 4,
        color: '#333',
    },
    /* The small vertical line between the GIF button and the input */
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: '#ccc',
        marginHorizontal: 12,
    },
    input: {
        flex: 1,
        color: '#333',
        fontSize: 15,
    },
    sendButton: {
        backgroundColor: '#E91E63',
        borderRadius: 20,
        padding: 8,
        marginLeft: 8,
    },

    // Modal styles
    gifPickerContainer: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? 30 : 20,
    },
});
