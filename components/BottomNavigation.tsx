import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function BottomNavigation() {
    const router = useRouter();
    const pathname = usePathname(); // Get the current route path

    // Tabs with their respective routes
    const tabs = [
        { name: 'home', icon: 'home-outline', activeIcon: 'home', route: '/' },
        { name: 'heart', icon: 'heart-outline', activeIcon: 'heart', route: '/favorites' },
        { name: 'add', icon: 'add', activeIcon: 'add', route: '/add' }, // Add button
        { name: 'chat', icon: 'chatbox-ellipses-outline', activeIcon: 'chatbox-ellipses', route: '/chat' },
        { name: 'person', icon: 'person-outline', activeIcon: 'person', route: '/profile' },
    ];

    return (
        <View className="bg-white py-4 pb-8 flex-row justify-around items-center shadow-lg rounded-t-4xl">
            {tabs.map((tab) => {
                // Render the add button differently
                if (tab.name === 'add') {
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            className="bg-pink-500 w-14 h-14 rounded-full -mt-8 flex items-center justify-center shadow-lg"
                            onPress={() => router.push(tab.route)}
                        >
                            <Ionicons name={tab.activeIcon} size={28} color="black" />
                        </TouchableOpacity>
                    );
                }

                // Render other tabs with toggling icons
                return (
                    <TouchableOpacity
                        key={tab.name}
                        onPress={() => router.push(tab.route)}
                        className="flex items-center justify-center"
                    >
                        <Ionicons
                            name={pathname === tab.route ? tab.activeIcon : tab.icon}
                            size={24}
                            color={pathname === tab.route ? 'black' : 'gray'}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
