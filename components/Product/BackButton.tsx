import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
    onPress: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
    return (
        <TouchableOpacity style={styles.backButton} onPress={onPress}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
});
