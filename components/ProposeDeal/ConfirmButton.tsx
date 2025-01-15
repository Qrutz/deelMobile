// ConfirmButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    label: string;
    onPress: () => void;
}

export default function ConfirmButton({ label, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#AB47BC',
        borderRadius: 8,
        paddingVertical: 19,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
