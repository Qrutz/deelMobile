

import { useAuth } from '@clerk/clerk-expo';
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

const UniversityScreen = ({ onNext }) => {
    return (
        <View>
            <Text>Choose your university</Text>
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
    const { getToken } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const completeOnboarding = async () => {
        setLoading(true);
        try {
            const token = await getToken(); // Fetch Clerk token
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/user/onboard`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include bearer token
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                Alert.alert('Success', 'Onboarding completed successfully!');
                router.replace('/'); // Redirect to home after success
            } else {
                Alert.alert('Error', 'Failed to complete onboarding.');
            }
        } catch (error) {
            console.error('Onboarding error:', error);
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Thank you for signing up!</Text>
            <Button title="Finish" onPress={completeOnboarding} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#4CAF50" />}
        </View>
    );
};