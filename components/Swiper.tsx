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
import { useRouter } from 'expo-router'; // or your nav method
import { Listing } from '@/types';
import ProductCard from './SwiperProductCard';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60;
const TAP_THRESHOLD = 10; // movement in px to consider it a "tap"

const Swiper = ({ products }: { products: Listing[] }) => {
    const [cards, setCards] = useState(products);

    const router = useRouter();  // or navigation from react-navigation

    const position = useRef(new Animated.ValueXY()).current;
    const secondCardScale = useRef(new Animated.Value(0.95)).current;

    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
    });

    // We'll store the initial touch-down coordinates
    const touchDown = useRef({ x: 0, y: 0 });

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,

        // Called when the user first touches down:
        onPanResponderGrant: (_, gestureState) => {
            touchDown.current = { x: gestureState.x0, y: gestureState.y0 };
        },

        // Called for every move:
        onPanResponderMove: (_, gesture) => {
            position.setValue({ x: gesture.dx, y: gesture.dy });

            // Animate second card's scale
            const dragDistance = Math.abs(gesture.dx);
            const newScale = 0.95 + (dragDistance / (width * 0.5)) * 0.05;
            secondCardScale.setValue(Math.min(newScale, 1));
        },

        // Called when the user releases:
        onPanResponderRelease: (_, gesture) => {
            const { dx, dy } = gesture;
            const totalDist = Math.sqrt(dx * dx + dy * dy);

            // 1) Check if it's basically a TAP (small movement)
            if (totalDist < TAP_THRESHOLD) {
                // => Navigate instead of swipe
                const topCard = cards[cards.length - 1];
                if (topCard) {
                    // e.g. router.push(`/product/${topCard.id}`)
                    router.push(`/product/${topCard.id}`);
                }

                // Also reset position
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start(() => {
                    // revert secondCardScale too
                    Animated.spring(secondCardScale, {
                        toValue: 0.95,
                        useNativeDriver: false,
                    }).start();
                });
                return;
            }

            // 2) If not a tap, check if the user swiped beyond threshold
            if (Math.abs(dx) > SWIPE_THRESHOLD) {
                // Animate out
                Animated.timing(position, {
                    toValue: {
                        x: dx > 0 ? width + 100 : -width - 100,
                        y: dy,
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

        setCards((prev) => {
            // remove last item
            return prev.slice(0, prev.length - 1);
        });
    };

    const renderCards = () => {
        return cards.map((card, index) => {
            const isTop = index === cards.length - 1;
            const isSecond = index === cards.length - 2;

            if (isTop) {
                // Top card (draggable / tappable)
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
                // Second card, scales up as user drags
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
            } else {
                // Third or deeper
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
        });
    };

    return <View style={styles.container}>{renderCards()}</View>;
};

export default Swiper;

// Style definitions
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
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
        // if you want a shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
});
