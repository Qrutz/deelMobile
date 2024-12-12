import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavigation() {
    const [activeTab, setActiveTab] = useState('home'); // Track the currently active tab

    const tabs: { name: string, activeIcon: keyof typeof Ionicons.glyphMap, inactiveIcon: keyof typeof Ionicons.glyphMap }[] = [
        { name: 'home', activeIcon: 'home', inactiveIcon: 'home-outline' },
        { name: 'heart', activeIcon: 'heart', inactiveIcon: 'heart-outline' },
        { name: 'add', activeIcon: 'add', inactiveIcon: 'add' }, // Add button is static
        { name: 'chat', activeIcon: 'chatbox-ellipses', inactiveIcon: 'chatbox-ellipses-outline' },
        { name: 'person', activeIcon: 'person', inactiveIcon: 'person-outline' },
    ];

    return (
        <View className="bg-white py-4 pb-8 flex-row justify-around items-center shadow-lg rounded-t-4xl">
            {tabs.map((tab) => {
                // Render the add button differently
                if (tab.name === 'add') {
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            className="bg-pink-500  rounded-full -mt-8 flex items-center justify-center shadow-lg"
                            onPress={() => setActiveTab(tab.name)}
                        >
                            <Ionicons name={tab.activeIcon} size={28} color="black" />
                        </TouchableOpacity>
                    );
                }

                // Render other tabs with toggling icons
                return (
                    <TouchableOpacity
                        key={tab.name}
                        onPress={() => setActiveTab(tab.name)}
                        className="flex items-center justify-center"
                    >
                        <Ionicons
                            name={activeTab === tab.name ? tab.activeIcon : tab.inactiveIcon}
                            size={24}
                            color={activeTab === tab.name ? 'black' : 'gray'}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
