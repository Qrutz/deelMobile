// ProductBottomCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface BottomCardProps {
    title: string;
    distance: number;
    condition: string;
    approximateValue: number;
    swapPrefs: string;
    description: string;
    isListingOwner: boolean;
    onPressMakeOffer: () => void;
}

export default function ProductBottomCard({
    title,
    distance,
    condition,
    approximateValue,
    swapPrefs,
    description,
    isListingOwner,
    onPressMakeOffer,
}: BottomCardProps) {
    const distanceLabel = distance ? `${distance.toFixed(1)} km away` : '';
    const conditionLabel = condition || 'Unknown';
    const valueLabel = approximateValue ? `$${approximateValue.toFixed(0)}` : 'N/A';

    return (
        <View style={styles.bottomCard}>
            <View style={styles.dragIndicator} />

            <View style={styles.titleRow}>
                <Text style={styles.titleText}>{title}</Text>
                {!!distanceLabel && <Text style={styles.distanceText}>{distanceLabel}</Text>}
            </View>

            {/* Attributes row */}
            <View style={styles.attributesRow}>
                <Text style={styles.attribute}>
                    Condition: <Text style={{ fontWeight: '600' }}>{conditionLabel}</Text>
                </Text>
                <Text style={styles.attribute}>
                    Value: <Text style={{ fontWeight: '600' }}>{valueLabel}</Text>
                </Text>
            </View>

            <Text style={styles.attribute}>
                Looking for: <Text style={{ fontWeight: '600' }}>{swapPrefs}</Text>
            </Text>

            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.description}>{description}</Text>

            {/* CTA */}
            {isListingOwner ? (
                <View style={styles.ownerActions}>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit Listing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.buyerActions}>
                    <TouchableOpacity style={styles.offerButton} onPress={onPressMakeOffer}>
                        <Text style={styles.offerButtonText}>Make an Offer</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    bottomCard: {
        marginTop: -30, // overlap the image
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: SCREEN_HEIGHT * 0.55,
        padding: 16,
        // shadow for iOS/Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
    },
    dragIndicator: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ccc',
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        maxWidth: '70%',
    },
    distanceText: {
        fontSize: 14,
        color: '#666',
    },
    attributesRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    attribute: {
        marginRight: 15,
        fontSize: 14,
        color: '#444',
    },
    descriptionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },

    ownerActions: {
        flexDirection: 'row',
        marginTop: 16,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#FFD54F',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    editButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#E57373',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    buyerActions: {
        marginTop: 16,
    },
    offerButton: {
        backgroundColor: '#E91E63',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    offerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
