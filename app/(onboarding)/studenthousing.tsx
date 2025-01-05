import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function StudentHousingScreen() {
    const router = useRouter();
    const { getToken } = useAuth();

    const [loading, setLoading] = useState(false); // Loading state for housing fetch
    const [housingOptions, setHousingOptions] = useState([]); // List of housing
    const [selectedHousing, setSelectedHousing] = useState<number | null>(null); // Selected housing ID
    const [livesInHousing, setLivesInHousing] = useState<boolean | null>(null); // Whether user lives in housing

    const scaleAnim = new Animated.Value(1); // Animation for buttons

    // Animation effects
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    // Fetch housing data dynamically
    const fetchHousing = async () => {
        setLoading(true);
        try {
            const token = await getToken();

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/studenthousing?city=Gothenburg`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) throw new Error('Failed to fetch housing');

            const data = await response.json();
            setHousingOptions(data);
        } catch (error) {
            console.error('Error fetching housing:', error);
            Alert.alert('Error', 'Could not load student housing.');
        } finally {
            setLoading(false);
        }
    };

    // Submit selected housing or "no housing"
    const submitHousing = async () => {
        setLoading(true);
        try {
            const token = await getToken();

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/housing`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        StudenthousingId: livesInHousing ? selectedHousing : null, // Set null if no housing
                    }),
                }
            );

            if (!response.ok) throw new Error('Failed to save housing');

            Alert.alert('Success', 'Housing selection saved!');
            router.push('/(onboarding)/Final'); // Move to preferences step
        } catch (error) {
            console.error('Error updating housing:', error);
            Alert.alert('Error', 'Could not update housing.');
        } finally {
            setLoading(false);
        }
    };

    // Render housing options
    const renderHousing = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[
                styles.housingItem,
                selectedHousing === item.id && styles.selectedHousingItem,
            ]}
            onPress={() => setSelectedHousing(item.id)}
        >
            <Image
                source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image, replace later
                style={styles.housingImage}
            />
            <Text style={styles.housingName}>{item.name}</Text>
        </TouchableOpacity>
    );

    // Ask if they live in student housing first
    if (livesInHousing === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Do you live in student housing?</Text>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={[styles.button, styles.yesButton]}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => {
                            setLivesInHousing(true);
                            fetchHousing(); // Load housing options if "yes"
                        }}
                    >
                        <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity
                    style={[styles.button, styles.noButton]}
                    onPress={() => {
                        setLivesInHousing(false);
                        submitHousing(); // Immediately submit with null if "no"
                    }}
                >
                    <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Show loading if housing options are still fetching
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Your Student Housing</Text>
            <FlatList
                data={housingOptions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderHousing}
                contentContainerStyle={styles.list}
            />
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={submitHousing}
                disabled={!selectedHousing}
            >
                <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginVertical: 10,
        alignItems: 'center',
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    yesButton: {
        backgroundColor: '#4CAF50',
    },
    noButton: {
        backgroundColor: '#E57373',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    list: {
        marginTop: 20,
    },
    housingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedHousingItem: {
        borderColor: '#4CAF50',
        backgroundColor: '#E8F5E9',
    },
    housingImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 15,
    },
    housingName: {
        fontSize: 16,
    },
    confirmButton: {
        marginTop: 20,
        paddingVertical: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
