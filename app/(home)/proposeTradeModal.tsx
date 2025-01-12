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
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Image } from 'expo-image';

import { useFetchListing } from '@/hooks/ListingHooks/useFetchListing';
import { useFetchUserListings } from '@/hooks/ListingHooks/useFetchMyListings';
import { Listing } from '@/types';

export default function DealBuilderScreen() {
    const { listingId, recipientId } = useLocalSearchParams();
    const router = useRouter();
    const { getToken } = useAuth();

    // 1) Fetch the target listing
    const { data: targetListing, isLoading: loadingTarget } = useFetchListing(listingId as string);

    // 2) Fetch the user’s items
    const { data: userItems, isLoading: loadingUserItems } = useFetchUserListings();

    // 3) Local state
    const [selectedItems, setSelectedItems] = useState<Listing[]>([]);
    const [partialCash, setPartialCash] = useState('');
    const [note, setNote] = useState('');

    // Toggle selection of items
    const toggleSelectItem = (item: Listing) => {
        setSelectedItems((prev) => {
            const alreadySelected = prev.some((sel) => sel.id === item.id);
            return alreadySelected
                ? prev.filter((sel) => sel.id !== item.id)
                : [...prev, item];
        });
    };

    // Handle sending the deal
    const handleSendDeal = async () => {
        if (!listingId || !recipientId) {
            Alert.alert('Error', 'Missing listingId or recipientId.');
            return;
        }

        // If you allow purely cash deals, remove the item check:
        if (selectedItems.length === 0 && (!partialCash || Number(partialCash) <= 0)) {
            Alert.alert('Error', 'Select an item or offer some cash.');
            return;
        }

        const listingAId = selectedItems[0]?.id;
        const listingBId = Number(listingId);
        const cashValue = partialCash ? Number(partialCash) : 0;

        try {
            const token = await getToken();
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/swap`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        listingAId,
                        listingBId,
                        recipientId,
                        partialCash: cashValue,
                        note,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert('Deal failed', errorData?.error || 'Unknown error');
                return;
            }

            Alert.alert('Success', 'Your deal has been proposed!');
            router.back();
        } catch (error) {
            console.error('Error proposing deal:', error);
            Alert.alert('Failed to propose. Please try again later.');
        }
    };

    // Renders each item from user’s inventory in smaller cards
    const renderItemCard = ({ item }: { item: Listing }) => {
        const isSelected = selectedItems.some((sel) => sel.id === item.id);

        return (
            <TouchableOpacity
                style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                onPress={() => toggleSelectItem(item)}
            >
                {item.ImageUrl ? (
                    <Image
                        source={{ uri: item.ImageUrl }}
                        style={styles.itemImage}
                        contentFit="cover"
                    />
                ) : (
                    <View style={styles.placeholderBox}>
                        <Ionicons name="image-outline" size={24} color="#999" />
                    </View>
                )}
                <Text
                    style={[styles.itemTitle, isSelected && styles.itemTitleSelected]}
                    numberOfLines={1}
                >
                    {item.title}
                </Text>
                {isSelected && (
                    <View style={styles.checkOverlay}>
                        <Ionicons name="checkmark" size={24} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    // Combined loading
    if (loadingTarget || loadingUserItems) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#E91E63" />
                <Text>Loading listing & your items...</Text>
            </View>
        );
    }

    // If no target listing
    if (!targetListing) {
        return (
            <View style={styles.centered}>
                <Text>Could not find the listing you’re aiming for.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#E91E63' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* KeyboardAvoidingView + ScrollView to handle input fields gracefully */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>Build Your Deal</Text>
                        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Target Listing */}
                    <View style={styles.targetSection}>
                        <Text style={styles.targetLabel}>You want to get:</Text>
                        <View style={styles.targetCard}>
                            {targetListing.ImageUrl ? (
                                <Image
                                    source={{ uri: targetListing.ImageUrl }}
                                    style={styles.targetImage}
                                    contentFit="cover"
                                />
                            ) : (
                                <View style={styles.targetPlaceholder}>
                                    <Ionicons name="image-outline" size={40} color="#999" />
                                </View>
                            )}
                            <View style={styles.targetInfo}>
                                <Text style={styles.targetTitle}>{targetListing.title}</Text>
                                {targetListing.price && targetListing.price > 0 ? (
                                    <Text style={styles.targetPrice}>
                                        {targetListing.price.toFixed(0)} kr
                                    </Text>
                                ) : (
                                    <Text style={styles.swapOnly}>Might be free or swap-only</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Arrow / divider */}
                    <View style={styles.arrowContainer}>
                        <Ionicons name="arrow-down-outline" size={32} color="#E91E63" />
                        <Text style={styles.arrowText}>Offer your items + optional cash</Text>
                    </View>

                    {/* User’s Inventory Grid */}
                    <FlatList
                        data={userItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItemCard}
                        numColumns={3}  // <--- More columns to fit more items
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        contentContainerStyle={styles.listContentContainer}
                        scrollEnabled={false} // We'll rely on the ScrollView
                    />

                    {/* Partial Cash Field */}
                    <View style={styles.partialCashContainer}>
                        <Text style={styles.partialCashLabel}>Add Partial Cash?</Text>
                        <View style={styles.partialCashRow}>
                            <Ionicons name="cash-outline" size={20} color="#333" style={{ marginRight: 6 }} />
                            <TextInput
                                style={styles.partialCashInput}
                                value={partialCash}
                                onChangeText={setPartialCash}
                                placeholder="e.g. 50"
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                            <Text style={{ fontSize: 16, marginLeft: 6 }}>kr</Text>
                        </View>
                    </View>

                    {/* Selected Items Preview */}
                    {selectedItems.length > 0 && (
                        <View style={styles.selectedItemsBox}>
                            <Text style={styles.selectedItemsTitle}>
                                You’re Offering ({selectedItems.length} items):
                            </Text>
                            <FlatList
                                data={selectedItems}
                                horizontal
                                keyExtractor={(itm) => `selected-${itm.id}`}
                                contentContainerStyle={{ paddingVertical: 8 }}
                                renderItem={({ item }) => (
                                    <View style={styles.selectedItemBadge}>
                                        <Text style={styles.selectedItemBadgeText}>{item.title}</Text>
                                    </View>
                                )}
                            />
                        </View>
                    )}

                    {/* Note / Extra Message */}
                    <Text style={styles.noteLabel}>Add a note (optional)</Text>
                    <TextInput
                        style={styles.noteInput}
                        value={note}
                        onChangeText={setNote}
                        placeholder="e.g. 'I’ll add 50 kr because my items are smaller...'"
                        placeholderTextColor="#999"
                        multiline
                    />

                    {/* Send Button */}
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendDeal}>
                        <Text style={styles.sendButtonText}>Send Deal</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/* --------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 12,
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 10,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        color: '#333',
    },
    closeButton: {
        padding: 6,
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Target Listing */
    targetSection: {
        marginBottom: 10,
    },
    targetLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    targetCard: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    targetImage: {
        width: 70,
        height: 70,
        borderRadius: 6,
        marginRight: 10,
    },
    targetPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 6,
        marginRight: 10,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    targetInfo: {
        flex: 1,
    },
    targetTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    targetPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#E91E63',
    },
    swapOnly: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
    },

    /* Arrow / Divider */
    arrowContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    arrowText: {
        fontSize: 14,
        color: '#E91E63',
        marginTop: 2,
    },

    /* Grid Items */
    listContentContainer: {
        paddingBottom: 16,
    },
    itemCard: {
        backgroundColor: '#f9f9f9',
        width: '31%',  // so 3 items fit in a row with spacing
        borderRadius: 8,
        marginBottom: 12,
        padding: 8,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    itemCardSelected: {
        backgroundColor: '#f06292',
    },
    itemImage: {
        width: '100%',
        height: 70,
        borderRadius: 6,
        marginBottom: 6,
    },
    placeholderBox: {
        width: '100%',
        height: 70,
        borderRadius: 6,
        marginBottom: 6,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    itemTitleSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    checkOverlay: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 18,
        padding: 2,
    },

    /* Partial Cash */
    partialCashContainer: {
        backgroundColor: '#fafafa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    partialCashLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
    },
    partialCashRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    partialCashInput: {
        backgroundColor: '#f8f8f8',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: 70,
        color: '#333',
    },

    /* Selected Items */
    selectedItemsBox: {
        backgroundColor: '#fafafa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    selectedItemsTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    },
    selectedItemBadge: {
        backgroundColor: '#E91E63',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
    },
    selectedItemBadgeText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },

    /* Note Input */
    noteLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
        marginLeft: 2,
    },
    noteInput: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        textAlignVertical: 'top',
        marginBottom: 16,
        color: '#333',
    },

    /* Send Button */
    sendButton: {
        backgroundColor: '#E91E63',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 30, // extra margin in case keyboard is up
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
