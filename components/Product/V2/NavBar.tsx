import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavBarProps {
    onBack: () => void;
    onChat?: () => void;
    showChatIcon?: boolean;
}

export default function NavBar({ onBack, onChat, showChatIcon }: NavBarProps) {
    return (
        <View style={styles.navBar}>
            <TouchableOpacity onPress={onBack} style={styles.navIconLeft}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {showChatIcon && onChat && (
                <TouchableOpacity onPress={onChat} style={styles.navIconRight}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 10,
        backgroundColor: 'transparent', // No background color
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    navIconLeft: {
        padding: 6,
    },
    navIconRight: {
        padding: 6,
    },
});
