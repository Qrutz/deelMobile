import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Modal,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductPicker from './ProductPicker';

interface SelectedProduct {
    id: number;
    title?: string;
    imageUrl?: string;
}

interface ChatInputBarProps {
    // Called when the user finally presses send
    onSendMessage: (params: {
        content: string;

        listingId?: number; // if we're attaching a product
        type: 'text' | 'productCard';
    }) => void;
    sellerUserId?: string; // if we're attaching a product
}

export default function ChatInputBar({ onSendMessage, sellerUserId }: ChatInputBarProps) {
    const [messageText, setMessageText] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    // 1) Open product picker
    const handleOpenPicker = () => {
        setShowPicker(true);
    };

    // 2) After user picks a product
    const handleSelectListing = (listingId: number) => {
        // We could store just the ID, or also store title, image, etc.
        setSelectedProduct({ id: listingId });
        setShowPicker(false);
    };

    // 3) Clear the attached product if user wants
    const handleRemoveProduct = () => {
        setSelectedProduct(null);
    };

    // 4) Press "Send"
    const handleSend = () => {
        if (!messageText.trim() && !selectedProduct) {
            return; // Nothing to send
        }

        if (selectedProduct) {
            // We have a product attached => "productCard" message
            onSendMessage({
                content: messageText.trim(),
                listingId: selectedProduct.id,
                type: 'productCard',
            });
        } else {
            // Normal text-only
            onSendMessage({
                content: messageText.trim(),
                type: 'text',
            });
        }

        // Clear the input and attached product after sending
        setMessageText('');
        setSelectedProduct(null);
    };

    return (
        <View style={styles.container}>
            {/* If a product is attached, show a small preview row */}
            {selectedProduct && (
                <View style={styles.attachedRow}>
                    <Text style={styles.attachedText}>
                        Attached product ID: {selectedProduct.id}
                    </Text>
                    <TouchableOpacity onPress={handleRemoveProduct}>
                        <Ionicons name="close-circle" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            )}

            {/* The text input row + send button */}
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

            {/* The "Propose Deal" (attach product) button */}
            <TouchableOpacity style={styles.dealButton} onPress={handleOpenPicker}>
                <Ionicons name="pricetag" size={20} color="#333" />
                <Text style={styles.dealButtonText}>Propose Deal</Text>
            </TouchableOpacity>

            {/* The product picker as a modal */}
            <Modal visible={showPicker} animationType="slide" transparent={false}>
                <ProductPicker
                    onSelectListing={handleSelectListing}
                    onCancel={() => setShowPicker(false)}
                    sellerUserId={sellerUserId!} // We know it's defined here
                />
            </Modal>
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
    attachedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffd4e5',
        padding: 6,
        borderRadius: 6,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    attachedText: {
        color: '#333',
        fontWeight: '600',
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
    dealButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dealButtonText: {
        marginLeft: 6,
        fontWeight: '600',
        color: '#333',
    },
});
