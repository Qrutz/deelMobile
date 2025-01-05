

import UniversityScreen from '@/screens/UniversityOnboard';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, useRouter } from 'expo-router';
import React, { useState } from 'react'
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default function Index() {
    return (
        <View>
            <Text>Welcome to the app</Text>

            <Button title="Go to University Onboarding" onPress={() => router.push('/(onboarding)/university')} />
        </View>
    );
}


