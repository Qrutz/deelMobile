

import UniversityScreen from '@/screens/UniversityOnboard';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react'
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';

export default function Index() {
    const steps = ['Welcome', 'University', 'Profile', 'Housing', 'Preferences', 'Finish'];
    const [stepIndex, setStepIndex] = useState(0);

    // Move to the next step
    const nextStep = () => setStepIndex((prev) => prev + 1);

    // Render steps
    return (
        <View style={styles.container}>
            {stepIndex === 0 && <WelcomeScreen onNext={nextStep} />}
            {stepIndex === 1 && <UniversityScreen onNext={nextStep} />}
            {stepIndex === 2 && <ProfileScreen onNext={nextStep} />}
            {stepIndex === 3 && <HousingScreen onNext={nextStep} />}
            {stepIndex === 4 && <PreferencesScreen onNext={nextStep} />}
            {stepIndex === 5 && <FinishScreen />}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


const WelcomeScreen = ({ onNext }) => {
    return (
        <View>
            <Text>Welcome to the app</Text>
            <Button title="Next" onPress={onNext} />
        </View>
    );
}



const ProfileScreen = ({ onNext }) => {
    return (
        <View>
            <Text>Fill out your profile</Text>
            <Button title="Next" onPress={onNext} />
        </View>
    );
}

const HousingScreen = ({ onNext }) => {
    return (
        <View>
            <Text>Choose your housing</Text>
            <Button title="Next" onPress={onNext} />
        </View>
    );
}


const PreferencesScreen = ({ onNext }) => {
    return (
        <View>
            <Text>Choose your preferences</Text>
            <Button title="Next" onPress={onNext} />
        </View>
    );
}

const FinishScreen = () => {
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
