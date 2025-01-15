// PartialCashInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    partialCash: string;
    onChangeCash: (val: string) => void;
}

export default function PartialCashInput({ partialCash, onChangeCash }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Add Partial Cash?</Text>
            <View style={styles.row}>
                <Ionicons name="cash-outline" size={20} color="#333" style={{ marginRight: 6 }} />
                <TextInput
                    style={styles.input}
                    value={partialCash}
                    onChangeText={onChangeCash}
                    placeholder="e.g. 50"
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                />
                <Text style={{ fontSize: 16, marginLeft: 6 }}>kr</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#f8f8f8',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: 70,
        color: '#333',
    },
});
