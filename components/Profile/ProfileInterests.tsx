import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    interests: string[];
    canEdit?: boolean;         // If true, show Edit button
    onEditPress?: () => void;  // Callback for editing
}

export function ProfileInterests({
    interests,
    canEdit = true,
    onEditPress,
}: Props) {
    return (
        <View style={styles.interestsSection}>
            <Text style={styles.interestsTitle}>Interests</Text>

            {/* Interests Row */}
            <View style={styles.interestsList}>
                {interests.map((interest, idx) => (
                    <View style={styles.interestTag} key={idx}>
                        <Text style={styles.interestTagText}>{interest}</Text>
                    </View>
                ))}
            </View>

            {/* Optional Edit Button */}
            {canEdit && (
                <TouchableOpacity style={styles.editInterestsButton} onPress={onEditPress}>
                    <Ionicons name="pencil-outline" size={14} color="#333" />
                    <Text style={styles.editInterestsButtonText}>Edit Interests</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    interestsSection: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    interestsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    interestsList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    interestTag: {
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: '#FFE4F2', // lightPink
        borderRadius: 16,
        paddingVertical: 8,
        alignItems: 'center',
    },
    interestTagText: {
        fontSize: 13,
        color: '#333',
    },
    editInterestsButton: {
        flexDirection: 'row',
        gap: 6,
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 6,
    },
    editInterestsButtonText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#333',
    },
});
