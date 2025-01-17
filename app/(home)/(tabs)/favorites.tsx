// PaymentSheetScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export default function PaymentSheetScreen() {
    const [loading, setLoading] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    async function createPaymentIntentOnServer(amount: number) {
        // Suppose your server is at some base URL
        const response = await fetch(`${API_URL}/payment/create-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }), // e.g. 5000 => $50
        });
        if (!response.ok) {
            throw new Error('Failed to create payment intent');
        }
        const { clientSecret } = await response.json();
        return clientSecret;
    }

    async function openPaymentSheet() {
        try {
            setLoading(true);

            // 1) Create PaymentIntent with the partial-cash amount (e.g., $50 -> 5000)
            const clientSecret = await createPaymentIntentOnServer(5000);

            // 2) Initialize the Payment Sheet
            const initResponse = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'My Swap App',
                // If you want an ephemeralKey for saved cards, you'd pass that too
            });
            if (initResponse.error) {
                Alert.alert('Error', initResponse.error.message);
                setLoading(false);
                return;
            }

            // 3) Present the Payment Sheet
            const presentResponse = await presentPaymentSheet();
            setLoading(false);

            if (presentResponse.error) {
                Alert.alert('Payment Failed', presentResponse.error.message);
            } else {
                Alert.alert('Payment Success!', 'Partial Cash has been paid!');
                // (Optional) Call your backend to confirm the swap's partial cash is now paid
            }
        } catch (err: any) {
            setLoading(false);
            Alert.alert('Error', err.message);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pay Partial Cash</Text>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Pay $50" onPress={openPaymentSheet} />
            )}
        </View>
    );
}
