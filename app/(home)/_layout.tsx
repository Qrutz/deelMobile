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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Slot, useRouter, usePathname } from 'expo-router';
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import BottomNavigation from '@/components/BottomNavigation';

export default function HomeLayout() {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const pathname = usePathname();
    const { user } = useUser();

    const [loading, setLoading] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState(false);

    // Check if user is onboarded
    useEffect(() => {
        if (isSignedIn && user) {
            const onboarded = user.publicMetadata?.isOnboarded === true; // Check Clerk metadata
            setIsOnboarded(onboarded);
            setLoading(false);

            // Redirect to onboarding if not onboarded
            if (!onboarded) {
                router.replace('/(onboarding)/onboarding');
            }
        } else {
            setLoading(false);
        }
    }, [isSignedIn, user]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    // Animation for button scaling
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start(() => router.push('/(auth)/sign-in'));
    };

    return (
        <>
            <SignedIn>
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <Slot />
                    </View>
                    {!pathname.startsWith('/chat/') && !pathname.startsWith('/product/') && (
                        <BottomNavigation />
                    )}
                </View>
            </SignedIn>

            <SignedOut>
                <View style={styles.container}>
                    {/* Background Image */}
                    <View style={styles.imageContainer}>
                        <ImageBackground
                            source={require('../../assets/images/landing-page-image.jpg')} // Replace with your image path
                            style={styles.image}
                        >
                            <LinearGradient
                                colors={['transparent', 'white']} // Gradient for fade effect
                                style={styles.gradient}
                            />
                        </ImageBackground>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Image
                            source={require('../../assets/logo.png')} // Replace with your logo path
                            style={styles.logo}
                        />
                        <Text style={styles.subtitle}>WELCOME TO DEEL</Text>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                            >
                                <Text style={styles.buttonText}>Sign in</Text>
                            </TouchableOpacity>
                        </Animated.View>
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
    subtitle: {
        fontSize: 18,
        color: '#777777',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#8E44AD',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    logo: {
        width: 150,
        height: 90,
        marginBottom: 25,
    },
});

