import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useFetchUserListings } from '@/hooks/ListingHooks/useFetchMyListings';
import ProductCard from '@/components/ProductCard';
import { ProfileInterests } from '@/components/Profile/ProfileInterests';
import { ProfileHeader } from '@/components/Profile/ProfileHeader';
import { useFetchMySwaps } from '@/hooks/SwapHooks/useFetchMySwaps';
import DealCard from '@/components/Profile/DealCard';
import { router } from 'expo-router';

// Import our new sub-components


export default function ProfilePage() {
    const { signOut, getToken } = useAuth();
    const { data: dealsData, isLoading: dealsLoading, isError: dealsError } = useFetchMySwaps();


    const [userData, setUserData] = useState<null | {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        profileImageUrl: string | null;
        balance: number;
        university: { id: string; name: string };
        Studenthousing: { id: number; name: string; /* ... */ };
    }>(null);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Deels' | 'saved'>('Deels');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await getToken();
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/user/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF3C80" />
            </View>
        );
    }

    // Demo placeholders if your API doesn’t return them:
    const userRating = 0;
    const userReviewsCount = 0;
    const userTokens = userData?.balance ?? 0;
    const userLocation = userData?.Studenthousing.name ?? 'Unknown';
    const interests = ['Arts', 'Crafts', 'Gardening'];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            {/* --- Header Bar --- */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton1}>
                    <Ionicons name="log-out-outline" size={22} color="#333" />
                </TouchableOpacity>
            </View>

            {/* --- Profile Header (Sub-Component) --- */}
            <ProfileHeader
                profileImageUrl={userData?.profileImageUrl ?? ''}
                name={userData?.name ?? 'Jane Doe'}
                rating={userRating}
                reviewsCount={userReviewsCount}
                location={userLocation}
                tokens={userTokens}
            />

            {/* --- Interests (Sub-Component) --- */}
            <ProfileInterests
                interests={interests}
                canEdit={true} // since it's current user, show "Edit"
                onEditPress={() => Alert.alert('Edit Interests', 'Show an edit modal here')}
            />

            {/* --- Tabs --- */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'Deels' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('Deels')}
                >
                    <Text
                        style={[styles.tabButtonText, activeTab === 'Deels' && styles.tabButtonTextActive]}
                    >
                        My Deels
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'saved' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('saved')}
                >
                    <Text
                        style={[styles.tabButtonText, activeTab === 'saved' && styles.tabButtonTextActive]}
                    >
                        Saved
                    </Text>
                </TouchableOpacity>
            </View>

            {/* --- Deels Content --- */}
            {activeTab === 'Deels' ? (
                <View style={styles.tabContent}>
                    {dealsLoading ? (
                        <ActivityIndicator />
                    ) : dealsError ? (
                        <Text style={styles.emptyStateText}>Failed to load your deals.</Text>
                    ) : dealsData && dealsData.length > 0 ? (
                        <View style={styles.gridContainer}>
                            {dealsData.map((deal) => (
                                <View style={styles.gridItem} key={deal.id}>
                                    <DealCard
                                        deal={deal}
                                        onPress={() => {
                                            router.push(`/deal/${deal.id}`);
                                        }}
                                    />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <>
                            <Text style={styles.emptyStateText}>No deals in progress</Text>
                            {/* Maybe a "Create Deal" button if relevant */}
                        </>
                    )}
                </View>
            ) : (
                <View style={styles.tabContent}>
                    {/* Saved listings or something else */}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Header
    headerContainer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        // ...
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    signOutButton1: {
        position: 'absolute',
        right: 50,
    },
    // Tabs
    tabContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        marginHorizontal: 25,
        marginBottom: 10,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#FF3C80',
    },
    tabButtonText: {
        fontSize: 13,
        color: '#333',
    },
    tabButtonTextActive: {
        color: '#FFF',
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 25,
        borderRadius: 8,
        marginBottom: 60,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#777',
    },
    addButton: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: '#FF3C80',
    },
    addButtonText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',

    },
    gridItem: {
        width: '100%',
        marginBottom: 16,
    },
});
