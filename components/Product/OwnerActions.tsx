import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function OwnerActions() {
    return (
        <View style={styles.ownerActionsContainer}>
            <Text style={styles.ownerNote}>This is your listing!</Text>

            {/** Example "edit" button */}
            <TouchableOpacity style={styles.editButton} onPress={() => console.log('Edit pressed')}>
                <Text style={styles.editButtonText}>Edit Listing</Text>
            </TouchableOpacity>

            {/** You could add a delete or share button here as well */}
        </View>
    );
}

const styles = StyleSheet.create({
    ownerActionsContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    ownerNote: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#1976D2',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
