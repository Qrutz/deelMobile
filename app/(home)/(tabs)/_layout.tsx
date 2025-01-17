import { router, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import React, { useRef } from 'react';
import { Image } from 'react-native';

export default function TabLayout() {
    // Animation for scaling effect
    const scaleAnim = useRef(new Animated.Value(1)).current;





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
                    title: 'Deels',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'pricetags' : 'pricetags-outline'}
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
                    title: '', // no tab title
                    tabBarIcon: () => (
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => router.push('/(home)/modaltest')}
                            >
                                {/* Replace Ionicons 'add' with your local image */}
                                <Image
                                    source={require('../../../assets/images/Asset_6.png')}
                                    style={styles.recyclingIcon}
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    ),
                    // Remove this line (or set it to an actual style instead of display:none)
                    // tabBarStyle: { display: 'none' }
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
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Web shadow
        elevation: 5,                      // Android shadow
    },
    tabLabel: {
        fontSize: 12,                      // Smaller label font size
        fontWeight: '600',                 // Bold labels
    },
    addButton: {
        backgroundColor: '#FF1493',        // Bright pink
        width: 59,
        height: 55,
        borderRadius: 16,                  // Fully circular button
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Web elevation
        elevation: 5,                      // Android elevation
        marginBottom: -8,                  // Raise button above the bar
    },
    recyclingIcon: {
        width: 30,
        height: 30,
        // If you want it white, you can do tintColor if it's a monochrome asset:
        tintColor: '#FFF',
        // optional
        resizeMode: 'contain',
    },
});
