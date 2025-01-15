// DealNoteInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
    note: string;
    onChangeNote: (val: string) => void;
}

export default function DealNoteInput({ note, onChangeNote }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Add a note (optional)</Text>
            <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={onChangeNote}
                placeholder="e.g. 'I’ll add 50 kr because my item is smaller...'"
                placeholderTextColor="#999"
                multiline
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
        marginLeft: 2,
    },
    noteInput: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        textAlignVertical: 'top',
        color: '#333',
    },
});
