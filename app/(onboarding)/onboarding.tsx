import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';


// Screen Dimensions
const { width } = Dimensions.get('window');

export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Lottie Animation */}
            {Platform.OS !== 'web' && (
                <LottieView
                    source={require('@/assets/lottie/Animation - 1736110146697.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                />
            )}

            {/* Text Content */}
            <Text style={styles.title}>Welcome to Deel</Text>
            <Text style={styles.subtitle}>
                Connect with your campus and start trading today!
            </Text>

            {/* Action Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(onboarding)/university')}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    animation: {
        width: width * 0.8, // Adjust width dynamically
        height: width * 0.8,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: '#4CAF50',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
