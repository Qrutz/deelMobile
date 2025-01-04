import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Add Linear Gradient
import { useRouter } from 'expo-router';

export default function AuthScreen() {

    const router = useRouter();

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
                <Text style={styles.title}>PASS THE TORCH!</Text>
                <Text style={styles.subtitle}>WELCOME TO [APP NAME]</Text>
                <Text style={styles.description}>
                    Buy. Sell. Repeat The Magic.
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/auth/sign-in')}
                >
                    <Text style={styles.buttonText}>LOG IN</Text>
                </TouchableOpacity>
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
        height: '55%', // Image height
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#777777',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#555555',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#E91E63',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
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
});
