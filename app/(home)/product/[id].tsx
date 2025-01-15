
import NavBar from '@/components/Product/V2/NavBar';
import ProductBottomCard from '@/components/Product/V2/ProductBottomCard';
import ProductImageCarousel from '@/components/Product/V2/ProductImageSection';
import ProductImageSection from '@/components/Product/V2/ProductImageSection';
import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';


const mockListing = {
    title: 'Mini Fridge',
    imageUrl: 'https://s42814.pcdn.co/wp-content/uploads/2022/07/best_mini_fridge_panel-scaled.jpg.optimal.jpg',
    distance: 1.5,
    condition: 'Good',
    approximateValue: 300,
    swapPrefs: 'Open to anything...',
    description: 'Lightly used fridge...',
    isListingOwner: false,
};

export default function ProductPage() {
    return (
        <View style={styles.container}>
            <NavBar
                onBack={() => console.log('Back pressed')}
                onBookmark={() => console.log('Bookmark pressed')}
                onShare={() => console.log('Share pressed')}
            />

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
            >
                <ProductImageCarousel
                    images={[
                        'https://s42814.pcdn.co/wp-content/uploads/2022/07/best_mini_fridge_panel-scaled.jpg.optimal.jpg',
                        'https://i.blocketcdn.se/pictures/recommerce/1207165686/0e954736-6fad-495e-ac80-e51aa78448e2.jpg?type=mob_iphone_li_large_retina',
                        'https://i.blocketcdn.se/pictures/recommerce/1208702560/67abd2f1-3dc3-411f-b903-124ce667541c.jpg?type=mob_iphone_li_large_retina',
                    ]}
                />
                <ProductBottomCard {...mockListing} onPressMakeOffer={() => { }} />
            </ScrollView>
        </View>
    );
}

const HEADER_HEIGHT = 60;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',  // Key: transparent so we can see the image
    },
    scrollContainer: {
        // Remove marginTop: 60 so the image can appear behind the NavBar
        // marginTop: HEADER_HEIGHT, 
    },
    scrollContent: {
        paddingBottom: 40,
    },
});
