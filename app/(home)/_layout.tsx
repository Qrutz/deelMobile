import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Link, Slot, usePathname, useRouter } from 'expo-router';
import BottomNavigation from '@/components/BottomNavigation';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';

export default function HomeLayout() {
    const pathname = usePathname();
    const router = useRouter();
    const { getToken } = useAuth();

    // Hide Bottom Nav for specific routes
    const hideBottomNav = pathname.startsWith('/chat/') || pathname.startsWith('/product/');

    // Onboarding Check State
    const [loading, setLoading] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const token = await getToken(); // Fetch auth token
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/user/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch user data');

                const userData = await response.json();
                setIsOnboarded(userData.isOnboarded);

                // Redirect if not onboarded
                if (!userData.isOnboarded) {
                    router.replace('/onboarding'); // Replace with your onboarding route
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        checkOnboarding();
    }, []);

    if (loading) {
        // Loading screen while checking onboarding status
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <>
            {/* Signed-in user */}
            <SignedIn>
                <View style={styles.container}>
                    <Slot />
                    {!hideBottomNav && <BottomNavigation />}
                </View>
            </SignedIn>

            {/* Signed-out user */}
            <SignedOut>
                <View style={styles.container}>
                    <Text>Sign in to view this page</Text>
                    <Link href="/(auth)/sign-in">Sign in</Link>
                </View>
            </SignedOut>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
