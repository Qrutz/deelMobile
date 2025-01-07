import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import React, { useRef } from 'react';

export default function TabLayout() {
    // Animation for scaling effect
    const scaleAnim = useRef(new Animated.Value(1)).current;

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
        }).start();
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#000000', // Active tab color
                tabBarInactiveTintColor: '#888',  // Inactive tab color
                headerShown: false,              // Hide header
                tabBarStyle: styles.tabBar,      // Custom tab bar style
                tabBarLabelStyle: styles.tabLabel, // Label styling
            }}
        >
            {/* Home Tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'home-sharp' : 'home-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            {/* Favorites Tab */}
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'heart' : 'heart-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            {/* Add Listing Tab - Custom Floating Button */}
            <Tabs.Screen
                name="addListing"
                options={{
                    title: '', // Hide title
                    tabBarIcon: () => (
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                            >
                                <Ionicons name="add" size={30} color="white" />
                            </TouchableOpacity>
                        </Animated.View>
                    ),
                    tabBarLabelStyle: { display: 'none' }, // Hide label explicitly
                    tabBarStyle: { display: 'none' }, // Hide tab bar styling for this button
                }}
            />


            {/* Chat Tab */}
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'chatbubble' : 'chatbubble-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            {/* Profile Tab */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',              // Fixed position at the bottom
        bottom: 0,                         // Aligns at bottom
        left: 0,
        right: 0,
        height: 70,                        // Slightly taller bar
        paddingTop: 10,                    // Padding for elevation
        paddingBottom: 10,                 // Padding for button click feedback
        borderTopLeftRadius: 20,           // Rounded corners
        borderTopRightRadius: 20,
        backgroundColor: '#fff',           // White background
        shadowColor: '#000',               // Shadow color
        shadowOffset: { width: 0, height: -2 }, // Drop shadow at the top
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,                      // Android shadow
    },
    tabLabel: {
        fontSize: 12,                      // Smaller label font size
        fontWeight: '600',                 // Bold labels
    },
    addButton: {
        backgroundColor: '#FF1493',        // Bright pink
        width: 65,
        height: 65,
        borderRadius: 35,                  // Fully circular button
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',               // Button shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,                      // Android elevation
        marginBottom: 20,                  // Raise button above the bar
    },
});
