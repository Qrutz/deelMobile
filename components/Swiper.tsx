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
import { useRouter } from 'expo-router';
import { Listing } from '@/types';
import ProductCard from './SwiperProductCard';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60;
const TAP_THRESHOLD = 10; // movement in px to consider it a "tap"

const Swiper = ({ products }: { products: Listing[] }) => {
    const [cards, setCards] = useState(products);

    const router = useRouter();

    const position = useRef(new Animated.ValueXY()).current;
    const secondCardScale = useRef(new Animated.Value(0.95)).current;

    // For rotation interpolation
    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
    });

    // Track the initial touch-down
    const touchDown = useRef({ x: 0, y: 0 });

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (_, gestureState) => {
            touchDown.current = { x: gestureState.x0, y: gestureState.y0 };
        },
        onPanResponderMove: (_, gesture) => {
            position.setValue({ x: gesture.dx, y: gesture.dy });
            // Animate the second card's scale as user drags
            const dragDistance = Math.abs(gesture.dx);
            const newScale = 0.95 + (dragDistance / (width * 0.5)) * 0.05;
            secondCardScale.setValue(Math.min(newScale, 1));
        },
        onPanResponderRelease: (_, gesture) => {
            const { dx, dy } = gesture;
            const distMoved = Math.sqrt(dx * dx + dy * dy);

            // 1) TAP check
            if (distMoved < TAP_THRESHOLD) {
                const topCard = cards[cards.length - 1];
                if (topCard) {
                    router.push(`/product/${topCard.id}`);
                }
                // Reset after tap
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start(() => {
                    Animated.spring(secondCardScale, {
                        toValue: 0.95,
                        useNativeDriver: false,
                    }).start();
                });
                return;
            }

            // 2) SWIPE check
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
                // Reset if not swiped far enough
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
        // 1) Remove the last card
        setCards((prev) => prev.slice(0, prev.length - 1));
        // 2) Then reset animations
        position.setValue({ x: 0, y: 0 });
        secondCardScale.setValue(0.95);
    };

    const renderCards = () => {
        return cards.map((card, index) => {
            const isTop = index === cards.length - 1;
            const isSecond = index === cards.length - 2;

            // We'll also define zIndex: top card > second card > others
            let zIndex = 0;
            if (isTop) zIndex = 2;
            else if (isSecond) zIndex = 1;

            if (isTop) {
                // Top card (draggable)
                return (
                    <Animated.View
                        key={card.id}
                        {...panResponder.panHandlers}
                        style={[
                            styles.card,
                            {
                                zIndex, // ensure top is on top
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
                // Second card (scales up a bit)
                return (
                    <Animated.View
                        key={card.id}
                        pointerEvents="none"
                        style={[
                            styles.card,
                            {
                                zIndex,
                                transform: [{ scale: secondCardScale }],
                            },
                        ]}
                    >
                        <ProductCard listing={card} />
                    </Animated.View>
                );
            } else {
                // Third or deeper card
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
                                zIndex,
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
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 5,
    },
});
