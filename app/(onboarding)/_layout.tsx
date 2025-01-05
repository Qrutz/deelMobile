import { Redirect, Slot } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';

export default function OnboardingLayout() {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState(false);

    useEffect(() => {
        if (user) {
            const onboarded = user.publicMetadata?.isOnboarded === true;
            setIsOnboarded(onboarded);
            setLoading(false);
        }
    }, [user]);

    // Handle loading state
    if (loading) return null; // Prevent render until check is complete

    // Redirect cases
    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />; // Signed out? Go to sign-in.
    }

    if (isOnboarded) {
        return <Redirect href="/" />; // Already onboarded? Go home.
    }

    // Default case - Show onboarding steps
    return <Slot />;
}
