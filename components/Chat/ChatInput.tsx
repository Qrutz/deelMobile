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
            {/* GIF Modal */}
            <Modal
                transparent
                visible={showGifPicker}
                animationType="slide"
            >
                <View style={styles.overlay}>
                    {/* Clickable background to close the sheet */}
                    <TouchableOpacity
                        style={styles.overlayBackground}
                        onPress={() => setShowGifPicker(false)}
                        activeOpacity={1}
                    />
                    {/* Bottom sheet with the gif picker */}
                    <View style={styles.bottomSheet}>
                        <GifPicker
                            onSelectGif={handleSelectGif}
                            onCancel={() => setShowGifPicker(false)}
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.inputRow}>
                {/* GIF Button */}
                <TouchableOpacity
                    onPress={() => setShowGifPicker(true)}
                    style={styles.gifButton}
                >
                    <Ionicons name="image" size={18} color="#666" />
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
                    placeholderTextColor="#aaa"
                />

                {/* Send Button */}
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFD6EC', // Pastel pink background (header zone)
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#FFBDE0', // Slightly darker pink for border
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 8,

        // Subtle shadow if desired:
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    gifButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gifButtonText: {
        marginLeft: 4,
        color: '#666',
        fontSize: 13,
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: '#EEE',
        marginHorizontal: 10,
    },
    input: {
        flex: 1,
        color: '#333',
        fontSize: 15,
        // remove default padding if desired
        paddingVertical: 0,
    },
    sendButton: {
        backgroundColor: '#E91E63',  // Pink accent
        borderRadius: 20,
        padding: 8,
        marginLeft: 8,
    },

    // Modal / Overlay
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlayBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)', // Slight dim
    },
    bottomSheet: {
        backgroundColor: '#fff',
        height: '60%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
});
