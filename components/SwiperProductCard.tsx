import React from 'react';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { Listing } from '@/types';
import { Image } from 'expo-image';

interface ProductCardProps {
    listing: Listing;
    distance?: number;      // distance in meters (optional)
    isSameBuilding?: boolean;  // if user & seller are in the same student housing
}

/**
 * Minimal "swipe-friendly" product card:
 * - Full-bleed image covering corners
 * - Small bottom overlay for Title, Price, Distance/Building, and short Description
 */
const ProductCard = ({
    listing,
    distance = 11,
    isSameBuilding = false,
}: ProductCardProps) => {
    // Format distance in meters/kilometers, e.g. "300m" or "1.2km"
    const formatDistance = (meters: number) => {
        if (meters < 1000) {
            return `${Math.round(meters)}m`;
        }
        const km = meters / 1000;
        return `${km.toFixed(1)}km`;
    };

    // Decide what to show in the "location label" (distance or "Same Building")
    let locationLabel = '';
    if (isSameBuilding) {
        locationLabel = 'Same Building';
    } else if (distance !== undefined) {
        locationLabel = formatDistance(distance);
    }

    return (

        <View style={styles.cardContainer}>
            {/* Full-bleed image (no padding). Covers entire card. */}
            <Image source={{ uri: listing.ImageUrl }} style={styles.image} contentFit='cover' />

            {/* Semi-transparent overlay at the bottom for text */}
            <View style={styles.overlay}>
                {/* Title & Price */}
                <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>
                        {listing.title}
                    </Text>

                    {/* Price text with emphasis */}
                    <View style={styles.priceWrapper}>
                        <Text style={styles.price}>{listing.price}</Text>
                    </View>
                </View>

                {/* Distance or "Same Building" label (if any) */}
                {!!locationLabel && (
                    <Text style={styles.distance}>{locationLabel}</Text>
                )}

                {/* Short description (truncated to 2 lines for a quick glance) */}
                {!!listing.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {listing.description}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        // If you're applying a borderRadius in the Swiper, apply the same radius here
        // and set overflow: 'hidden' to ensure the image corners are clipped.
    },

    // Full-bleed image: covers the entire container
    image: {
        ...StyleSheet.absoluteFillObject,
    },

    // Bottom overlay: a subtle gradient or solid background for readability
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // or a gradient
        paddingHorizontal: 12,
        paddingVertical: 8,
    },

    // Title & Price row
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginRight: 8,
    },

    /**
     * This wrapper is optional if you want to add 
     * a highlight background behind the price.
     */
    priceWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },

    price: {
        fontSize: 22,
        fontWeight: '800',
        color: '#ffeb3b',
        // Optional text shadow to make it "pop"

    },

    // Distance or "Same Building"
    distance: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },

    // Short description
    description: {
        marginTop: 4,
        fontSize: 14,
        lineHeight: 18,
        color: '#f5f5f5',
    },
});
