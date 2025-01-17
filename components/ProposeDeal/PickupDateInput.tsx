// PickupDateInput.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface PickupDateInputProps {
    pickupDate: Date | null;
    onChangeDate: (date: Date) => void;
}

export default function PickupDateInput({
    pickupDate,
    onChangeDate,
}: PickupDateInputProps) {
    const [showPicker, setShowPicker] = useState(false);

    // Format the date or provide a placeholder
    const displayText = pickupDate
        ? pickupDate.toLocaleString() // or custom format
        : 'Tap to choose a date & time';

    const handlePress = () => {
        setShowPicker(true);
    };

    const onDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            // Android: hide after one selection
            setShowPicker(false);
            if (selectedDate) {
                onChangeDate(selectedDate);
            }
        } else {
            // iOS: handle “set” or “dismissed”
            if (event.type === 'set' && selectedDate) {
                setShowPicker(false);
                onChangeDate(selectedDate);
            } else if (event.type === 'dismissed') {
                setShowPicker(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Tappable card to select or show the date/time */}
            <TouchableOpacity
                style={styles.cardContainer}
                onPress={handlePress}
                activeOpacity={0.9}
            >
                {/* Round icon matching the pickup location style */}
                <View style={styles.iconContainer}>
                    <Ionicons name="calendar-outline" size={24} color="#fff" />
                </View>

                {/* Text area (title + date) */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Pickup Date/Time</Text>
                    <Text style={styles.subtitle}>{displayText}</Text>
                </View>

                {/* Chevron icon on the right */}
                <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="#888"
                />
            </TouchableOpacity>

            {/* Show the system picker only if showPicker is true */}
            {showPicker && (
                <DateTimePicker
                    value={pickupDate || new Date()}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateTimeChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12, // match the same spacing as your PickupLocationCard
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,

        // Same subtle shadow as PickupLocationCard
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E91E63', // same pink accent
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        color: '#666',
    },
});
