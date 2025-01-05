import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View, Button, ActivityIndicator, Text, StyleSheet } from "react-native";

export default function FinishScreen() {
    const { getToken } = useAuth(); // Clerk auth
    const { user } = useUser(); // Clerk user
    const router = useRouter(); // Router for navigation
    const [loading, setLoading] = useState(false); // Loading state

    const completeOnboarding = async () => {
        setLoading(true); // Start loading

        try {
            const token = await getToken(); // Fetch token
            if (!token) throw new Error('No token found'); // Error handling if token is missing

            // Call backend to mark user as onboarded
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/user/onboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Pass bearer token
                },
            });

            if (!response.ok) throw new Error('Failed to complete onboarding'); // Error handling

            // Reload Clerk user session to fetch updated metadata
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
            <Text>Thank you for signing up!</Text>
            <Button
                title="Finish"
                onPress={completeOnboarding}
                disabled={loading} // Disable button when loading
            />
            {loading && <ActivityIndicator size="large" color="#4CAF50" />}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
