import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function SignedOutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome to the App!</Text>
            <Text style={styles.description}>
                Discover great features and content by signing in or creating an account.
            </Text>

            <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
            </Link>

            <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                    <Text style={styles.secondaryButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </Link>
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#E0E0E0',
    },
    secondaryButtonText: {
        color: '#333333',
        fontSize: 16,
    },
});
