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

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 60;

const Swiper = ({ products }: { products: Listing[] }) => {
    const [cards, setCards] = useState(products);

    // Animations
    const position = useRef(new Animated.ValueXY()).current;
    const secondCardScale = useRef(new Animated.Value(0.95)).current;

    // Rotate interpolation for the top card
    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
    });

    // Setup PanResponder
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            position.setValue({ x: gesture.dx, y: gesture.dy });

            // Animate the scale of the second card as user drags top card
            const dragDistance = Math.abs(gesture.dx);
            const newScale = 0.95 + (dragDistance / (width * 0.5)) * 0.05;
            secondCardScale.setValue(Math.min(newScale, 1));
        },
        onPanResponderRelease: (_, gesture) => {
            if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
                // Swipe out
                Animated.timing(position, {
                    toValue: {
                        x: gesture.dx > 0 ? width + 100 : -width - 100,
                        y: gesture.dy,
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

    // Remove top card and reset animations
    const removeTopCard = () => {
        position.setValue({ x: 0, y: 0 });
        secondCardScale.setValue(0.95);
        setCards((prev) => prev.slice(1));
    };

    // Helper to render each card’s content
    const renderCardContent = (card: Listing) => (
        <>
            <View style={styles.userContainer}>
                {card.user.profileImageUrl && (
                    <Image
                        source={{ uri: card.user.profileImageUrl }}
                        style={styles.userImage}
                    />
                )}
                <Text style={styles.userName}>{card.user.name}</Text>
            </View>
            <Image source={{ uri: card.ImageUrl }} style={styles.image} />
            <Text style={styles.title}>{card.title}</Text>
            <Text style={styles.price}>{card.price}</Text>
        </>
    );

    /**
     * Render the entire deck:
     * - The bottom cards come first
     * - The top card (last item in `cards`) is rendered last (so it's actually on top).
     */
    const renderCards = () => {
        return cards.map((card, index) => {
            const isTop = index === cards.length - 1;    // last item
            const isSecond = index === cards.length - 2; // second from last

            if (isTop) {
                // TOP CARD: PanResponder + rotation + position
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
                        {renderCardContent(card)}
                    </Animated.View>
                );
            } else if (isSecond) {
                // SECOND CARD: scale up slightly as user drags the top card
                return (
                    <Animated.View
                        key={card.id}
                        pointerEvents="none" // disable touches so only top card can be dragged
                        style={[
                            styles.card,
                            {
                                transform: [{ scale: secondCardScale }],
                            },
                        ]}
                    >
                        {renderCardContent(card)}
                    </Animated.View>
                );
            } else if (index < cards.length - 2) {
                // THIRD or deeper card: small scale, stacked behind
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
                                transform: [
                                    { scale: stackedScale },
                                    { translateY },
                                ],
                            },
                        ]}
                    >
                        {renderCardContent(card)}
                    </View>
                );
            }
            return null;
        });
    };

    return <View style={styles.container}>{renderCards()}</View>;
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // center the deck
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: width * 0.9,
        height: height * 0.58,
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
        marginTop: 5,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Swiper;
