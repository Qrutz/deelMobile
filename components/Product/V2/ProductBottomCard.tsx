import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProductBottomCardProps {
    title: string;
    distance: number;
    condition: string;
    approximateValue: number;
    swapPrefs: string;
    description: string;
    isListingOwner: boolean;

    sellerName?: string;
    sellerRating?: number;
    sellerProfileImg?: string;
    onPressChat?: () => void;
    onPressMakeOffer?: () => void; // Not used here because CTA is pinned in parent
}

export default function ProductBottomCard({
    title,
    distance,
    condition,
    approximateValue,
    swapPrefs,
    description,
    isListingOwner,

    sellerName = 'Design house',
    sellerRating = 4.9,
    sellerProfileImg,
    onPressChat,
}: ProductBottomCardProps) {

    const distanceLabel = distance ? `${distance.toFixed(1)} km away` : '';
    const conditionLabel = condition || 'Unknown';
    const valueLabel = approximateValue ? `$${approximateValue.toFixed(0)}` : 'N/A';

    return (
        <View style={styles.bottomCard}>
            {/* Scrollable content */}
            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.handleBar} />

                {/* SELLER ROW */}
                <View style={styles.sellerRow}>
                    <View style={styles.sellerLeft}>
                        <Image
                            source={
                                sellerProfileImg
                                    ? { uri: sellerProfileImg }
                                    : null
                            }
                            style={styles.sellerAvatar}
                        />
                        <View style={{ marginLeft: 8 }}>
                            <Text style={styles.sellerName}>{sellerName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="star" size={17} color="#ff1493" />
                                <Text style={styles.sellerRating}>
                                    {sellerRating.toFixed(1)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* Chat bubble on the right */}
                    <View style={styles.sellerRight}>
                        <View style={styles.chatBubble}>
                            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
                        </View>
                    </View>
                </View>
                {/* Title & distance row */}
                <View style={styles.titleRow}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {title}
                    </Text>
                    {!!distanceLabel && (
                        <Text style={styles.distanceText}>{distanceLabel}</Text>
                    )}
                </View>
                {/* Condition / Value / Swap Prefs */}
                <Text style={styles.attribute}>
                    Condition: <Text style={styles.bold}>{conditionLabel}</Text>
                </Text>
                <Text style={styles.attribute}>
                    Value: <Text style={styles.bold}>{valueLabel}</Text>
                </Text>
                <Text style={styles.attribute}>
                    Looking for: <Text style={styles.bold}>{swapPrefs}</Text>
                </Text>

                {/* Description */}
                <Text style={styles.descLabel}>Description</Text>
                <Text style={styles.descText}>{description}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
    },
    scrollArea: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    scrollContent: {
        paddingBottom: 80, // space in case we had a pinned CTA inside, but in this approach we keep CTA in parent
    },
    handleBar: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ccc',
        marginBottom: 12,
    },
    // Seller row
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sellerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#eee',
    },
    sellerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    sellerRating: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    sellerRight: {},
    chatBubble: {
        backgroundColor: '#000',
        borderRadius: 20,
        padding: 8,
    },
    // Title & distance
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        maxWidth: '65%',
    },
    distanceText: {
        fontSize: 14,
        color: '#666',
    },
    // Condition, Value, etc.
    attribute: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
    },
    bold: {
        fontWeight: '600',
    },
    // Description
    descLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
    },
    descText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555',
    },
});
