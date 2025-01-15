// DealHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DealHeaderProps {
    title: string;
    onClose: () => void;
}

export default function DealHeader({ title, onClose }: DealHeaderProps) {
    return (
        <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 10,
    },
    headerTitle: {
        flex: 1,
        fontSize: 23,
        fontWeight: '700',
        textAlign: 'center',
        color: '#333',
    },
    closeButton: {
        padding: 6,
    },
});
