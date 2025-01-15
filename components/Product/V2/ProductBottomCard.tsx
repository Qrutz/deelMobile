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
    sellerProfileImg: string;
    onPressChat?: () => void;
    location?: string;
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
    location = '',
}: ProductBottomCardProps) {

    // Build distance label + icon
    const distanceLabel = distance ? `${distance.toFixed(1)} km away` : '';
    const conditionLabel = condition || 'Unknown';
    const valueLabel = approximateValue ? `$${approximateValue.toFixed(0)}` : 'N/A';

    return (
        <View style={styles.bottomCard}>
            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>

                {/* optional drag handle */}
                {/* <View style={styles.handleBar} /> */}

                {/* SELLER ROW */}
                <View style={styles.sellerRow}>
                    <View style={styles.sellerLeft}>
                        <Image
                            source={{ uri: sellerProfileImg }}
                            style={styles.sellerAvatar}
                        />
                        <View style={{ marginLeft: 8 }}>
                            <Text style={styles.sellerName}>{sellerName}</Text>
                            <View style={styles.ratingRow}>
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
                            <Ionicons name="chatbubble-ellipses-outline" size={25} color="#fff" />
                        </View>
                    </View>
                </View>
                {/* END SELLER ROW */}

                {/* TITLE + DISTANCE ROW */}
                <View style={styles.titleRow}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {title}
                    </Text>

                    {/* If distance > 0, show location icon + text */}
                    {distance > 0 && (
                        <View style={styles.distanceRow}>
                            <Ionicons
                                name="location-outline"
                                size={16}
                                color="#b100c9"
                                style={{ marginRight: 4 }}
                            />
                            <Text style={styles.distanceText}>{distanceLabel}</Text>
                        </View>
                    )}
                </View>

                {/* DESCRIPTION as an info row for consistency */}
                <View style={styles.infoRowSpaceBetween}>
                    <View style={styles.rowLeft}>
                        <Text style={styles.infoLabel}>Description</Text>
                        <Text style={styles.infoValue}>{description}</Text>
                    </View>
                    {/* Could leave the right side empty or repurpose it */}
                    <View style={styles.rowRight} />
                </View>

                {/* TWO ROWS: Product Value vs Condition, Looking for vs Location */}
                <View style={styles.infoRowSpaceBetween}>
                    <View style={styles.rowLeft}>
                        <Text style={styles.infoLabel}>Product Value</Text>
                        <Text style={styles.infoValue}>{valueLabel}</Text>
                    </View>

                    <View style={styles.rowRight}>
                        <Text style={styles.infoLabel}>Condition</Text>
                        <Text style={styles.infoValue}>{conditionLabel}</Text>
                    </View>
                </View>

                <View style={styles.infoRowSpaceBetween}>
                    <View style={styles.rowLeft}>
                        <Text style={styles.infoLabel}>Interested to trade with</Text>
                        <Text style={styles.infoValue}>{swapPrefs}</Text>
                    </View>

                    <View style={styles.rowRight}>
                        <Text style={styles.infoLabel}>Location</Text>
                        <Text style={styles.infoValue}>{location || 'Unknown'}</Text>
                    </View>
                </View>

                {/* Add more rows or info as needed */}

            </ScrollView>
        </View>
    );
}

/* =========== STYLES =========== */
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
        paddingTop: 6,
    },
    scrollArea: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    scrollContent: {
        paddingBottom: 100,
    },

    // Seller row
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
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
        marginBottom: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerRating: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginLeft: 4,
    },
    sellerRight: {},
    chatBubble: {
        backgroundColor: '#000',
        borderRadius: 40,
        padding: 6,
        paddingHorizontal: 25,
    },

    // Title
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        maxWidth: '65%',
    },

    // Distance row
    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 14,
        color: '#666',
    },

    /* infoRow with space-between */
    infoRowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    rowLeft: {
        flex: 1,
        marginRight: 8,
    },
    rowRight: {
        flex: 1,
        alignItems: 'flex-end',
    },

    infoLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#666',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
});
