// ProductImageCarousel.tsx
import React, { useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Text,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
    images: string[]; // Array of image URLs
    height?: number;  // Optional override for carousel height
}

export default function ProductImageCarousel({
    images,
    height = 0.45 * Dimensions.get('window').height,
}: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / width);
        setCurrentIndex(newIndex);
    };

    return (
        <View style={[styles.container, { height }]}>
            <FlatList
                data={images}
                keyExtractor={(_, index) => `image-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                    <View style={{ width, height }}>
                        <Image
                            source={{ uri: item }}
                            style={[styles.image, { width, height }]}
                            resizeMode="cover"
                        />
                    </View>
                )}
            />

            {/* Slide Count e.g. "1/4" */}
            <View style={styles.slideCountContainer}>
                <Text style={styles.slideCountText}>
                    {currentIndex + 1}/{images.length}
                </Text>
            </View>

            {/* Dot pagination (optional) */}
            <View style={styles.paginationContainer}>
                {images.map((_, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <View
                            key={`dot-${index}`}
                            style={[
                                styles.dot,
                                isActive ? styles.dotActive : styles.dotInactive
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width,
        position: 'relative',
        backgroundColor: '#ddd',
    },
    image: {
        // The image will fill the carousel width/height
    },

    // This is the "1/4" overlay in the corner
    slideCountContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        paddingHorizontal: 9,
        paddingVertical: 5,
    },
    slideCountText: {
        color: '#fff',
        fontWeight: '600',
    },

    // Dot pagination row
    paginationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    dotInactive: {
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dotActive: {
        backgroundColor: '#fff',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});
