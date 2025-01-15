// SingleItemSelectorModal.tsx
import React from 'react';
import {
    View,
    Modal,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Listing } from '@/types';

interface Props {
    visible: boolean;
    userItems: Listing[];
    selectedItem: Listing | null;
    onSelectItem: (item: Listing) => void;
    onClose: () => void;
}

export default function SingleItemSelectorModal({
    visible,
    userItems,
    selectedItem,
    onSelectItem,
    onClose,
}: Props) {
    const renderItemCard = ({ item }: { item: Listing }) => {
        const isSelected = selectedItem?.id === item.id;

        return (
            <TouchableOpacity
                style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                onPress={() => onSelectItem(item)}
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

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                {/* Header Row */}
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Your Item</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Grid */}
                <FlatList
                    data={userItems}
                    keyExtractor={(itm) => itm.id.toString()}
                    renderItem={renderItemCard}
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    itemCard: {
        backgroundColor: '#f9f9f9',
        width: '31%',
        borderRadius: 8,
        marginBottom: 12,
        padding: 8,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    itemCardSelected: {
        backgroundColor: '#BA68C8',
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
});
