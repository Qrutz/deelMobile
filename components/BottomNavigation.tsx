import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { SignedIn } from '@clerk/clerk-expo';

export default function BottomNavigation() {
    const router = useRouter();
    const pathname = usePathname(); // Get the current route path

    const scaleAnim = useRef(new Animated.Value(1)).current;

    // **Add Loading State**
    const [isReady, setIsReady] = useState(false);

    // **Wait until pathname is resolved**
    useEffect(() => {
        if (pathname) {
            setIsReady(true); // Mark ready when pathname is available
        }
    }, [pathname]);

    // Routes where BottomNavigation should NOT render
    const hiddenRoutes: string[] = [
        '/onboarding',          // Group route
        '/product/',            // Matches dynamic routes like /product/[id]
        '/chat/',               // Matches dynamic routes like /chat/[id]
        '/auth/sign-in',        // Sign-in page
        '/auth/sign-up',        // Sign-up page
        '/onboarding/final',    // Onboarding sub-routes
        '/onboarding/university',
        '/personal',
        '/studenthousing',
        '/onboarding/onboarding',
    ];

    // Hide the BottomNavigation if the current route matches any of the hidden routes
    const shouldHideBottomBar =
        isReady && hiddenRoutes.some((route) => pathname.startsWith(route));

    // **Clean conditional render - Only render when ready**
    if (!isReady || shouldHideBottomBar) {
        return null; // Don't render BottomNavigation until pathname is ready
    }

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (route: string) => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start(() => {
            router.push(route);
        });
    };

    // Tabs with routes
    const tabs: { name: string, icon: keyof typeof Ionicons.glyphMap, activeIcon: keyof typeof Ionicons.glyphMap, route: string, label: string }[] = [
        { name: 'home', icon: 'home-outline', activeIcon: 'home', route: '/', label: 'Marketplace' },
        { name: 'heart', icon: 'heart-outline', activeIcon: 'heart', route: '/favorites', label: 'Favorites' },
        { name: 'add', icon: 'add', activeIcon: 'add', route: '/add-listing', label: '' }, // Add button
        { name: 'dashboard', icon: 'briefcase-outline', activeIcon: 'briefcase', route: '/seller-dashboard', label: 'My Listings' },
        { name: 'chat', icon: 'chatbox-ellipses-outline', activeIcon: 'chatbox-ellipses', route: '/chat', label: 'Chat' },
        { name: 'person', icon: 'person-outline', activeIcon: 'person', route: '/profile', label: 'Profile' },
    ];

    return (

        <View style={styles.container}>
            {tabs.map((tab) => {
                if (tab.name === 'add') {
                    return (
                        <Animated.View key={tab.name} style={{ transform: [{ scale: scaleAnim }] }}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPressIn={handlePressIn}
                                onPressOut={() => handlePressOut(tab.route)}
                            >
                                <Ionicons name={tab.activeIcon} size={30} color="white" />
                            </TouchableOpacity>
                        </Animated.View>
                    );
                }

                return (
                    <TouchableOpacity
                        key={tab.name}
                        onPress={() => router.push(tab.route)}
                        style={styles.tab}
                    >
                        <Ionicons
                            name={pathname === tab.route ? tab.activeIcon : tab.icon}
                            size={24}
                            color={pathname === tab.route ? '#000' : '#888'}
                        />
                        <Text style={[styles.label, { color: pathname === tab.route ? '#000' : '#888' }]}>{tab.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: 'red',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
    },
    addButton: {
        backgroundColor: '#FF1493',
        width: 65,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        marginTop: -12,
    },
    label: {
        fontSize: 10,
        marginTop: 2,
        fontWeight: 'bold',
    },
});
