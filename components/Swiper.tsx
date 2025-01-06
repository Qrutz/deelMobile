import React, { useRef, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
    PanResponder,
} from 'react-native';
import { Listing } from '@/types';
import ProductCard from './SwiperProductCard';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60;

const Swiper = ({ products }: { products: Listing[] }) => {
    const [cards, setCards] = useState(products);

    // Animations
    const position = useRef(new Animated.ValueXY()).current;
    const secondCardScale = useRef(new Animated.Value(0.95)).current;

    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
    });

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            position.setValue({ x: gesture.dx, y: gesture.dy });

            const dragDistance = Math.abs(gesture.dx);
            const newScale = 0.95 + (dragDistance / (width * 0.5)) * 0.05;
            secondCardScale.setValue(Math.min(newScale, 1));
        },
        onPanResponderRelease: (_, gesture) => {
            if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
                // Swiped out
                Animated.timing(position, {
                    toValue: {
                        x: gesture.dx > 0 ? width + 100 : -width - 100,
                        y: gesture.dy,
                    },
                    duration: 300,
                    useNativeDriver: false,
                }).start(() => removeTopCard());
            } else {
                // Reset
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
                Animated.spring(secondCardScale, {
                    toValue: 0.95,
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    const removeTopCard = () => {
        position.setValue({ x: 0, y: 0 });
        secondCardScale.setValue(0.95);
        setCards((prev) => prev.slice(0, prev.length - 1)); // remove last
    };

    /** Renders the deck from bottom -> top */
    const renderCards = () => {
        return cards.map((card, index) => {
            const isTop = index === cards.length - 1;
            const isSecond = index === cards.length - 2;

            if (isTop) {
                // TOP CARD
                return (
                    <Animated.View
                        key={card.id}
                        {...panResponder.panHandlers}
                        style={[
                            styles.card,
                            {
                                transform: [
                                    ...position.getTranslateTransform(),
                                    { rotate },
                                ],
                            },
                        ]}
                    >
                        <ProductCard listing={card} />
                    </Animated.View>
                );
            } else if (isSecond) {
                // SECOND CARD
                return (
                    <Animated.View
                        key={card.id}
                        pointerEvents="none"
                        style={[
                            styles.card,
                            {
                                transform: [{ scale: secondCardScale }],
                            },
                        ]}
                    >
                        <ProductCard listing={card} />
                    </Animated.View>
                );
            } else if (index < cards.length - 2) {
                // THIRD OR DEEPER
                const offsetFromTop = cards.length - 1 - index;
                const stackedScale = 0.95 - 0.03 * offsetFromTop;
                const translateY = -10 * offsetFromTop;

                return (
                    <View
                        key={card.id}
                        pointerEvents="none"
                        style={[
                            styles.card,
                            {
                                transform: [{ scale: stackedScale }, { translateY }],
                            },
                        ]}
                    >
                        <ProductCard listing={card} />
                    </View>
                );
            }

            return null; // if out of range
        });
    };

    return <View style={styles.container}>{renderCards()}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        position: 'absolute',
        width: width * 0.9,
        height: height * 0.58,
        // Remove padding so the image can fill the entire card
        // padding: 15,

        // Keep the card shape
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // If you want the image corners to be clipped, add:
        overflow: 'hidden',
    },
});

export default Swiper;
