import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Add Linear Gradient
import { useRouter } from 'expo-router';

export default function AuthScreen() {

    const router = useRouter();
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start(() => router.push('/auth/sign-in'));
    };

    return (
        <View style={styles.container}>
            {/* Background Image */}
            <View style={styles.imageContainer}>
                <ImageBackground
                    source={require('../../assets/images/landing-page-image.jpg')} // Replace with your image path
                    style={styles.image}
                >
                    <LinearGradient
                        colors={['transparent', 'white']} // Gradient for fade effect
                        style={styles.gradient}
                    />
                </ImageBackground>
            </View>

            {/* Text Content */}
            <View style={styles.content}>
                <Image
                    source={require('../../assets/logo.png')} // Replace with your logo path
                    style={styles.logo}
                />
                <Text style={styles.subtitle}>WELCOME TO DEEL</Text>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <Text className='' style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    imageContainer: {
        width: '100%',
        height: '50%', // Image height reduced slightly
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        width: '100%',
        height: '50%', // Gradient fade height
        bottom: 0, // Align to bottom of the image
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    subtitle: {
        fontSize: 18, // Slightly larger subtitle
        color: '#777777',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#8E44AD', // Updated to purple
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    logo: {
        width: 150, // Reduced size
        height: 90, // Reduced size
        marginBottom: 25, // More spacing below logo
    },
});
