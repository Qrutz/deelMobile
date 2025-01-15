// PickupDateInput.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface PickupDateInputProps {
    pickupDate: Date | null;
    onChangeDate: (date: Date) => void;
}

export default function PickupDateInput({ pickupDate, onChangeDate }: PickupDateInputProps) {
    const [showPicker, setShowPicker] = useState(false);

    // Format the date for display
    const displayText = pickupDate
        ? pickupDate.toLocaleString() // or a custom format
        : 'Select date & time';

    const handlePress = () => {
        setShowPicker(true);
    };

    const onDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            // On Android, the user selects once and we can hide right away
            setShowPicker(false);
            if (selectedDate) {
                onChangeDate(selectedDate);
            }
        } else {
            // iOS case
            if (event.type === 'set' && selectedDate) {
                // The user tapped "OK" in iOS, so we accept the date
                setShowPicker(false);
                onChangeDate(selectedDate);
            } else if (event.type === 'dismissed') {
                // The user tapped outside or "Cancel"
                setShowPicker(false);
            }
            // If it's just spinner scroll changes, do nothing yet (don't hide).
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Pickup Date/Time</Text>
            <TouchableOpacity style={styles.dateRow} onPress={handlePress}>
                <Text style={styles.dateText}>{displayText}</Text>
                <Ionicons name="calendar-outline" size={20} color="#666" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={pickupDate || new Date()}
                    textColor='#333'
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
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dateText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
});
