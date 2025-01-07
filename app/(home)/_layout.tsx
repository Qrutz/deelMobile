import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    Animated,
    Platform,
    AppState,
    AppStateStatus,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot, useRouter, usePathname, Stack } from 'expo-router';
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import BottomNavigation from '@/components/BottomNavigation';
import socket from '@/utils/socket';
import { Ionicons } from '@expo/vector-icons';


export default function HomeStack() {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const pathname = usePathname();
    const { user } = useUser();

    const [loading, setLoading] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState(false);


    // Check if user is onboarded
    useEffect(() => {
        const checkOnboarding = () => {
            if (isSignedIn && user) {
                const onboarded = user.publicMetadata?.isOnboarded === true;
                setIsOnboarded(onboarded);
                setLoading(false);

                if (!onboarded) {
                    // Use timeout or immediate to fix race condition
                    if (Platform.OS === 'ios') {
                        setTimeout(() => {
                            router.replace('/(onboarding)/onboarding');
                        }, 1); // Small delay for iOS
                    } else {
                        setImmediate(() => {
                            router.replace('/(onboarding)/onboarding');
                        }); // Immediate for Android
                    }
                }
            } else {
                setLoading(false);
            }
        };

        checkOnboarding();
    }, [isSignedIn, user]); // Depend on auth and user state

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }



    return (
        <><SignedIn>
            <Stack
                screenOptions={{
                    gestureEnabled: true,
                    headerShown: false,
                }}
            >
                <Stack.Screen name="(tabs)" />
                {/*

            {/*
If you also have an “index.tsx” in (home), you can explicitly
define it or rely on auto-resolving. If you define it, do:
*/}


            </Stack>

        </SignedIn>
            <SignedOut>
                <View style={styles.container}>
                    {/* Background Image */}
                    <View style={styles.imageContainer}>
                        <ImageBackground
                            source={require('../../assets/images/landing-page-image.jpg')}
                            style={styles.image}
                        >
                            <LinearGradient
                                colors={['transparent', 'white']}
                                style={styles.gradient}
                            />
                        </ImageBackground>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>Welcome to Deel</Text>
                        <Text style={styles.subtitle}>
                            Connect with your campus and start trading today!
                        </Text>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.signInButton]}
                                onPress={() => router.push('/(auth)/sign-in')}
                            >
                                <Text style={styles.buttonText}>Sign In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.signUpButton]}
                                onPress={() => router.push('/(auth)/sign-up')}
                            >
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SignedOut>


        </>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '50%',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        width: '100%',
        height: '50%',
        bottom: 0,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logo: {
        width: 150,
        height: 90,
        marginBottom: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 10,
    },
    signInButton: {
        backgroundColor: '#8E44AD',
    },
    signUpButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});