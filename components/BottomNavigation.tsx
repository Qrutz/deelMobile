import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function BottomNavigation() {
    const router = useRouter();
    const pathname = usePathname(); // Get the current route path

    // Tabs with their respective routes
    const tabs: { name: string, icon: keyof typeof Ionicons.glyphMap, activeIcon: keyof typeof Ionicons.glyphMap, route: string }[] = [
        { name: 'home', icon: 'home-outline', activeIcon: 'home', route: '/' },
        { name: 'heart', icon: 'heart-outline', activeIcon: 'heart', route: '/favorites' },
        { name: 'add', icon: 'add', activeIcon: 'add', route: '/add-listing' }, // Add button
        { name: 'chat', icon: 'chatbox-ellipses-outline', activeIcon: 'chatbox-ellipses', route: '/chat' },
        { name: 'person', icon: 'person-outline', activeIcon: 'person', route: '/profile' },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                // Render the add button differently
                if (tab.name === 'add') {
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.addButton}
                            onPress={() => router.push(tab.route as any)}
                        >
                            <Ionicons name={tab.activeIcon} size={36} color="white" />
                        </TouchableOpacity>
                    );
                }

                // Render other tabs with toggling icons
                return (
                    <TouchableOpacity
                        key={tab.name}
                        onPress={() => router.push(tab.route as any)}
                        style={styles.tab}
                    >
                        <Ionicons
                            name={pathname === tab.route ? tab.activeIcon : tab.icon}
                            size={28}
                            color={pathname === tab.route ? '#000' : '#888'}
                        />
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
        paddingVertical: 10,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    addButton: {
        backgroundColor: '#FF4081',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        marginTop: -30, // Move it upward for prominence
    },
});
