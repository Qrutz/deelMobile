import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import LottieView from 'lottie-react-native';

export default function FinishScreen() {
    const { getToken } = useAuth(); // Clerk auth
    const { user } = useUser(); // Clerk user
    const router = useRouter(); // Router for navigation
    const [loading, setLoading] = useState(false); // Loading state

    // Handle onboarding completion
    const completeOnboarding = async () => {
        setLoading(true); // Start loading
        try {
            const token = await getToken(); // Fetch token
            if (!token) throw new Error('No token found'); // Error if missing token

            // API request to complete onboarding
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/user/onboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Pass token
                },
            });

            if (!response.ok) throw new Error('Failed to complete onboarding'); // Handle errors

            // Reload Clerk user session for metadata updates
            await user?.reload();

            // Redirect to home page
            router.replace('/');
        } catch (error) {
            console.error('Onboarding error:', error);
            Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <View style={styles.container}>
            {/* Lottie Animation */}
            {Platform.OS !== 'web' && (
                <LottieView
                    source={require('@/assets/lottie/confetti.json')} // Replace with actual confetti animation
                    autoPlay
                    loop={true}
                    style={styles.animation}
                />
            )}

            {/* Congratulatory Message */}
            <Text style={styles.title}>🎉 You're all set!</Text>
            <Text style={styles.subtitle}>Thank you for completing the setup. Welcome to Deel!</Text>

            {/* Finish Button */}
            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={completeOnboarding}
                disabled={loading} // Disable when loading
            >
                <Text style={styles.buttonText}>{loading ? "Finishing..." : "Finish"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginBottom: 20,
    },
    animation: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#A5D6A7', // Light green when disabled
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});
