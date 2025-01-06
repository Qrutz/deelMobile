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

const { width, height } = Dimensions.get('window');

export default function Marketplace() {
    const [cards, setCards] = useState([
        { id: '1', name: 'Atomic Ski boots', price: '$32', image: 'https://via.placeholder.com/150' },
        { id: '2', name: 'Snowboard Jacket', price: '$50', image: 'https://via.placeholder.com/150' },
        { id: '3', name: 'Winter Gloves', price: '$15', image: 'https://via.placeholder.com/150' },
    ]);

    const position = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(0.95)).current;

    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
    });

    const opacity = scale.interpolate({
        inputRange: [0.95, 1],
        outputRange: [0.8, 1],
        extrapolate: 'clamp',
    });

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
            const swipeThreshold = 60;

            if (gesture.dx > swipeThreshold) {
                Animated.parallel([
                    Animated.spring(position, {
                        toValue: { x: width + 100, y: gesture.dy },
                        useNativeDriver: false,
                    }),
                    Animated.spring(scale, {
                        toValue: 1,
                        useNativeDriver: false,
                    }),
                ]).start(() => removeCard());
            } else if (gesture.dx < -swipeThreshold) {
                Animated.parallel([
                    Animated.spring(position, {
                        toValue: { x: -width - 100, y: gesture.dy },
                        useNativeDriver: false,
                    }),
                    Animated.spring(scale, {
                        toValue: 1,
                        useNativeDriver: false,
                    }),
                ]).start(() => removeCard());
            } else {
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    const removeCard = () => {
        position.setValue({ x: 0, y: 0 });
        scale.setValue(0.95);
        setCards((prevCards) => prevCards.slice(1));
    };

    return (
        <View style={styles.container}>
            {cards.length > 1 && (
                <Animated.View
                    style={[styles.card, styles.tiltedCard, { transform: [{ scale: scale }], opacity: opacity }]}
                >
                    <Image source={{ uri: cards[1].image }} style={styles.image} />
                    <Animated.Text style={[styles.title, { opacity }]}>{cards[1].name}</Animated.Text>
                    <Animated.Text style={[styles.price, { opacity }]}>{cards[1].price}</Animated.Text>
                </Animated.View>
            )}

            {cards.length > 0 && (
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.card,
                        {
                            transform: [
                                ...position.getTranslateTransform(),
                                { rotate: rotate },
                            ],
                        },
                    ]}
                >
                    <Image source={{ uri: cards[0].image }} style={styles.image} />
                    <Text style={styles.title}>{cards[0].name}</Text>
                    <Text style={styles.price}>{cards[0].price}</Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: width * 0.9,
        height: height * 0.6,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        position: 'absolute',
    },
    tiltedCard: {
        transform: [{ rotate: '-5deg' }],
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
});
