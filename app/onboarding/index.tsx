

import React, { useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';

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
    return (
        <View>
            <Text>Thank you for signing up!</Text>
        </View>
    );
}