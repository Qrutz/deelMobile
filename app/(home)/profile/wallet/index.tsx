import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function WalletPage() {
    const { getToken } = useAuth();
    const navigation = useNavigation();

    // State variables for wallet data
    const [balance, setBalance] = useState(0);
    const [stripeConnected, setStripeConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch wallet data from the backend API
    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const token = await getToken();
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_API_BASE_URL}/wallet`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch wallet data');
                }
                const data = await response.json();
                setBalance(data.balance);
                setStripeConnected(data.stripeConnected);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to load wallet data.');
            } finally {
                setLoading(false);
            }
        };

        fetchWalletData();
    }, [getToken]);

    // Function to initiate Stripe Connect flow
    const handleConnectStripe = async () => {
        try {
            const token = await getToken();
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/stripe/connect`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to connect to Stripe');
            }
            const data = await response.json();
            if (data.url) {
                Linking.openURL(data.url);
            } else {
                Alert.alert('Error', 'No URL provided for Stripe connection.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to connect to Stripe.');
        }
    };

    // Function to handle managing payouts (e.g., navigating to another screen)
    const handleManagePayouts = () => {
        navigation.push('/managePayouts');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF3C80" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Wallet</Text>

            <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceValue}>${balance.toFixed(2)}</Text>
            </View>

            <View style={styles.stripeContainer}>
                {stripeConnected ? (
                    <TouchableOpacity
                        style={styles.manageButton}
                        onPress={handleManagePayouts}
                    >
                        <Text style={styles.manageButtonText}>Manage Payouts</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.connectButton}
                        onPress={handleConnectStripe}
                    >
                        <Text style={styles.connectButtonText}>Connect to Stripe</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
        color: '#333',
    },
    balanceContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    balanceLabel: {
        fontSize: 16,
        color: '#777',
    },
    balanceValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
        marginTop: 8,
    },
    stripeContainer: {
        alignItems: 'center',
    },
    connectButton: {
        backgroundColor: '#FF3C80',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    connectButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    manageButton: {
        backgroundColor: '#4facfe',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    manageButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
