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
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import LottieView from 'lottie-react-native';

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

            // Update housing info in the database
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/housing`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        StudenthousingId: livesInHousing ? selectedHousing : null,
                    }),
                }
            );

            if (!response.ok) throw new Error('Failed to save housing');

            // Join chatroom for selected student housing
            if (livesInHousing && selectedHousing) {
                const chatResponse = await fetch(
                    `${process.env.EXPO_PUBLIC_API_BASE_URL}/chats/join`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            studenthousingId: selectedHousing, // Pass housing ID
                        }),
                    }
                );

                if (!chatResponse.ok) throw new Error('Failed to join chatroom');
            }

            // Move to final step
            router.push('/(onboarding)/location');
        } catch (error) {
            console.error('Error during submission:', error);
            Alert.alert('Error', 'Could not save housing or join chat.');
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
                {/* Lottie Animation */}
                {Platform.OS !== 'web' && (
                    <LottieView
                        source={require('@/assets/lottie/idkmane.json')} // Replace with your animation path
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                )}

                <Text style={styles.title}>Do you live in student housing?</Text>
                <Text style={styles.description}>
                    Connect with your campus and discover student housing options nearby.
                </Text>
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
        padding: 40, // Increased padding
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
        paddingVertical: 10, // Reduced vertical padding
        paddingHorizontal: 50, // Increased horizontal padding
        borderRadius: 30,
        marginVertical: 10,
        alignItems: 'center',
        width: '80%',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
        paddingVertical: 10, // Reduced vertical padding
        paddingHorizontal: 50, // Increased horizontal padding
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        padding: 10,
        color: 'white',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    animation: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
});
