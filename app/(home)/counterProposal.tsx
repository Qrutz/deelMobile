// CounterProposalScreen.tsx (quick example)
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useFetchSwap } from '@/hooks/SwapHooks/useFetchSwap';

export default function CounterProposalScreen() {
    const router = useRouter();
    const { swapId } = useLocalSearchParams() as { swapId: string };
    const { getToken } = useAuth();

    // Fetch existing swap
    const { data: deal, isLoading, isError } = useFetchSwap(swapId);

    // Local states for partialCash, note, location, etc.
    const [partialCash, setPartialCash] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (deal) {
            // initialize local states from the existing deal
            setPartialCash(deal.partialCash?.toString() || '');
            setNote(deal.note || '');
        }
    }, [deal]);

    const handleSubmitCounter = async () => {
        try {
            const token = await getToken();
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/swap/${swapId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partialCash: Number(partialCash) || 0,
                    note,
                    // if you're changing pickup location as well, include it
                    // pickupLat,
                    // pickupLng,
                    // etc...
                    // Also maybe set status="pending" or "counter" if you prefer
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                Alert.alert('Failed', errData?.error || 'Unknown error');
                return;
            }

            Alert.alert('Success', 'Counter proposed successfully!');
            router.back(); // go back to the DealDetail
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to send counter proposal');
        }
    };

    if (isLoading) {
        return <Text>Loading Swap...</Text>;
    }
    if (isError || !deal) {
        return <Text>Failed to load swap data</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Counter Proposal for Swap #{swapId}</Text>

            <Text style={styles.label}>New Partial Cash</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={partialCash}
                onChangeText={setPartialCash}
            />

            <Text style={styles.label}>Note / Comments</Text>
            <TextInput
                style={[styles.input, { height: 60 }]}
                multiline
                value={note}
                onChangeText={setNote}
            />

            {/* if you want to change location, add a "Pick location" button, etc. */}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitCounter}>
                <Text style={styles.submitButtonText}>Send Counter</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 16, backgroundColor: '#fff',
    },
    header: {
        fontSize: 18, fontWeight: '700', marginBottom: 12,
    },
    label: {
        fontSize: 14, fontWeight: '600', marginBottom: 4,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: '#9C27B0',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFF',
        fontWeight: '700',
    },
});
