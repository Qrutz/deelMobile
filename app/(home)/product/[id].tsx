import NavBar from '@/components/Product/V2/NavBar';
import ProductBottomCard from '@/components/Product/V2/ProductBottomCard';
import ProductImageCarousel from '@/components/Product/V2/ProductImageSection';
import { useFetchListing } from '@/hooks/ListingHooks/useFetchListing';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
} from 'react-native';


const mockListing = {
    title: 'Mini Fridge',
    distance: 1.5,
    condition: 'Good',
    approximateValue: 300,
    swapPrefs: 'Open to anything...',
    description: 'Lightly used fridge...',
    isListingOwner: false,
    images: [
        'https://s42814.pcdn.co/wp-content/uploads/2022/07/best_mini_fridge_panel-scaled.jpg.optimal.jpg',
        'https://i.blocketcdn.se/pictures/recommerce/1207165686/0e954736-6fad-495e-ac80-e51aa78448e2.jpg?type=mob_iphone_li_large_retina',
        'https://i.blocketcdn.se/pictures/recommerce/1208702560/67abd2f1-3dc3-411f-b903-124ce667541c.jpg?type=mob_iphone_li_large_retina',
    ],
};

export default function ProductPage() {
    const { id } = useLocalSearchParams() as { id: string };

    const { data: listing, isLoading, isError } = useFetchListing(id);

    if (isLoading || !listing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error fetching listing</Text>
            </View>
        );
    }

    console.log('Listing:', listing);

    const images = [
        listing.ImageUrl,
        'https://i.blocketcdn.se/pictures/recommerce/1207165686/0e954736-6fad-495e-ac80-e51aa78448e2.jpg?type=mob_iphone_li_large_retina',
        'https://i.blocketcdn.se/pictures/recommerce/1208702560/67abd2f1-3dc3-411f-b903-124ce667541c.jpg?type=mob_iphone_li_large_retina',

    ];

    return (
        <View style={styles.container}>

            {/* 1) Overlaid NavBar */}
            <NavBar
                onBack={() => router.back()}
                onBookmark={() => console.log('Bookmark')}
                onShare={() => console.log('Share')}
            />

            {/* 2) Hero image carousel at top */}
            <View style={styles.heroContainer}>
                <ProductImageCarousel images={images} />
            </View>

            {/* 3) The bottom card that overlaps the hero by -30 */}
            <View style={styles.bottomCardContainer}>

                <ProductBottomCard
                    title={listing.title}
                    distance={mockListing.distance}
                    condition={listing.condition || 'Unknown'}
                    approximateValue={listing.price || 0}
                    swapPrefs={listing.swapPreferences || 'Open to anything...'}
                    description={listing.description}
                    location={listing.locationName || 'Unknown'}
                    isListingOwner={listing.isOwner || false}
                    sellerName={listing.user.fullName || 'No name'}
                    sellerRating={5.0}
                    sellerProfileImg={listing.user.image || ''}
                    onPressChat={() => console.log('Chat pressed')}
                />
            </View>

            {/* 4) Pinned CTA at bottom of the SCREEN */}
            {!mockListing.isListingOwner && (
                <View style={[styles.pinnedCTA, { zIndex: 99 }]}>
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => {
                            router.push({ pathname: '/proposeTradeModal', params: { listingId: listing.id, recipientId: listing.userId } });
                        }}
                    >
                        <Text style={styles.ctaText}>Make an Offer</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

/** ----------- STYLES ----------- **/

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // or transparent if you want
    },
    heroContainer: {
        height: SCREEN_HEIGHT * 0.45, // hero height
        zIndex: 1,
    },
    bottomCardContainer: {
        flex: 1,
        marginTop: -30, // overlaps the hero by 30 px
        zIndex: 2,
    },
    pinnedCTA: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',

        borderColor: '#eee',
        padding: 10,
    },
    ctaButton: {
        backgroundColor: '#b100c9',
        borderRadius: 8,
        paddingVertical: 18,
        alignItems: 'center',
    },
    ctaText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
