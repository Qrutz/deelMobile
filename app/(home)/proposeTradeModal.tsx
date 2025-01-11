import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFetchUserListings } from '@/hooks/ListingHooks/useFetchMyListings';

/** Example shape for an item the user can offer in a swap */
interface UserItem {
    id: string | number;
    title: string;
    // maybe an image, quantity, etc.
}

export default function SwapModal() {
    // 1) Retrieve the listing or other relevant info from route params
    // e.g., /swap-modal?listingId=123
    const { listingId } = useLocalSearchParams();
    const router = useRouter();

    const { data: userItems, isLoading } = useFetchUserListings();

    // 2) Local states
    const [selectedItems, setSelectedItems] = useState<UserItem[]>([]);

    const [note, setNote] = useState('');

    // 3) Suppose we fetch the user’s available items for a swap
    //    (You’d call your own API or local data)


    // 4) Toggling selection of items to swap
    const toggleItemSelection = (item: UserItem) => {
        const alreadySelected = selectedItems.find((it) => it.id === item.id);
        if (alreadySelected) {
            // remove
            setSelectedItems((prev) => prev.filter((it) => it.id !== item.id));
        } else {
            // add
            setSelectedItems((prev) => [...prev, item]);
        }
    };

    // 5) Handling “Send Swap Request”
    const handleSendSwap = () => {
        // Typically, you'd call your API or use socket to finalize the swap request
        console.log('Swap requested for listingId:', listingId);
        console.log('Offering items:', selectedItems);
        console.log('User note:', note);

        // For now, just close the modal
        router.back();
    };

    // 6) If still loading user’s items
    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#E91E63" />
                <Text>Loading your items...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.modalContainer}>
            {/* Header row */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Propose a Swap</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Instructional text */}
            <Text style={styles.description}>
                You’re proposing a swap for listing #{listingId}. Select items you want to offer.
            </Text>

            {/* List of user’s items */}
            <FlatList
                data={userItems}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 8 }}
                renderItem={({ item }) => {
                    const isSelected = selectedItems.some((it) => it.id === item.id);
                    return (
                        <TouchableOpacity
                            style={[styles.itemRow, isSelected && styles.itemRowSelected]}
                            onPress={() => toggleItemSelection(item)}
                        >
                            <Text style={[styles.itemTitle, isSelected && styles.itemTitleSelected]}>
                                {item.title}
                            </Text>
                            {isSelected && <Ionicons name="checkmark" size={20} color="#fff" />}
                        </TouchableOpacity>
                    );
                }}
            />

            {/* Optional text note */}
            <Text style={styles.noteLabel}>Add a note (optional)</Text>
            <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="e.g. 'Let's trade soon!'"
                multiline
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.sendButton} onPress={handleSendSwap}>
                <Text style={styles.sendButtonText}>Send Swap Request</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

/* -------------- STYLES -------------- */
const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
        color: '#333',
    },
    closeButton: {
        padding: 6,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
    },
    itemRowSelected: {
        backgroundColor: '#FF1493',
    },
    itemTitle: {
        fontSize: 15,
        color: '#333',
    },
    itemTitleSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    noteLabel: {
        fontSize: 14,
        color: '#333',
        marginTop: 16,
        marginBottom: 6,
    },
    noteInput: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    sendButton: {
        backgroundColor: '#E91E63',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
