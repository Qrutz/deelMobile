import React from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';

interface ComposeMessageModalProps {
    visible: boolean;
    onClose: () => void;
    listingTitle: string;
    listingImage: string;
    listingPrice: string;
    userMessage: string;
    setUserMessage: (val: string) => void;
    onSend: () => void;
}

export default function ComposeMessageModal({
    visible,
    onClose,
    listingTitle,
    listingImage,
    listingPrice,
    userMessage,
    setUserMessage,
    onSend,
}: ComposeMessageModalProps) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Send a message about:</Text>

                    <View style={styles.productPreview}>
                        <Image source={{ uri: listingImage }} style={styles.previewImage} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.previewTitle}>{listingTitle}</Text>
                            <Text style={styles.previewPrice}>{listingPrice}</Text>
                        </View>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Type a short note..."
                        value={userMessage}
                        onChangeText={setUserMessage}
                        multiline
                    />

                    <View style={styles.modalButtonRow}>
                        <TouchableOpacity style={styles.modalButton} onPress={onSend}>
                            <Text style={styles.modalButtonText}>Send</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                            onPress={onClose}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    productPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    previewImage: {
        width: 60,
        height: 60,
        borderRadius: 6,
        marginRight: 10,
    },
    previewTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    previewPrice: {
        fontSize: 14,
        color: '#4CAF50',
    },
    input: {
        minHeight: 60,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
        color: '#333',
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#E91E63',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
