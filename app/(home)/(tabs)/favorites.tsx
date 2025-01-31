import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '@clerk/clerk-expo';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export default function PaymentSheetScreen() {
    const [loading, setLoading] = useState(false);
    const { userId } = useAuth();

    // In a real app, you'd get `userId` from auth (e.g., context, Redux, or props).
    // For demonstration, let's hardcode it or assume you pass it in some other way.


    async function handleConnectStripe() {
        try {
            setLoading(true);

            // 1) Call your backend to create or fetch the Express account & get onboarding URL
            const response = await fetch(`${API_URL}/payment/create-express-account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to create Express account link');
            }

            const data = await response.json();
            const { url } = data;

            if (!url) {
                throw new Error('No onboarding URL returned');
            }

            // 2) Open Stripe's onboarding link in a browser
            const result = await WebBrowser.openBrowserAsync(url);
            // result may contain info about whether the user closed the browser, etc.

            setLoading(false);

            // Optionally, you can handle the "return_url" or "refresh_url" flow if Stripe
            // redirects back to your app. That typically requires deep linking or a universal link.

        } catch (err: any) {
            setLoading(false);
            Alert.alert('Error', err.message || 'Something went wrong');
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Connect Your Stripe Account</Text>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Connect Stripe" onPress={handleConnectStripe} />
            )}
        </View>
    );
}
