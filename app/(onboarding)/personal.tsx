import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo'; // Clerk's hook
import { useRouter } from 'expo-router';

export default function NameInputScreen() {
    const { user } = useUser(); // Access user object
    const router = useRouter();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name.');
            return;
        }

        setLoading(true);
        try {
            // Update Clerk's user object directly
            await user?.update({ firstName: name }); // Clerk API call to update name

            // Navigate to the next step
            router.push('/(onboarding)/studenthousing');
        } catch (error) {
            console.error('Error updating name:', error);
            Alert.alert('Error', 'Could not save your name.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.label}>What is your name?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    contentContainer: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#A5D6A7',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
