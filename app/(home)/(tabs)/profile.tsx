import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // for settings icon, star icons, etc.
import { useAuth } from '@clerk/clerk-expo';
import { useFetchUserListings } from '@/hooks/ListingHooks/useFetchMyListings';
import ProductCard from '@/components/ProductCard';

export default function ProfilePage() {
    const { signOut, getToken } = useAuth(); // Clerk auth
    const { data, isLoading, isError } = useFetchUserListings();

    // Adjust shape according to your API
    const [userData, setUserData] = useState<{
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        profileImageUrl: string | null;
        balance: number;
        university: { id: string; name: string };
        Studenthousing: {
            id: number;
            name: string;
            latitude: number;
            longitude: number;
            chatId: string | null;
            cityId: number;
        };
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Deels' | 'saved'>('Deels');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await getToken();
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/me`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

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

    const handleSettingsPress = () => {
        // Navigate to your settings page or open a modal
        Alert.alert('Settings', 'Go to settings screen here.');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.mainPink} />
            </View>
        );
    }

    // Example placeholders if your API doesn’t return them yet
    const userRating = 0;
    const userReviewsCount = 0;
    const userTokens = 10; // or use userData?.balance

    // Example interests
    const interests = ['Arts', 'Crafts', 'Gardening'];

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
            {/* ---------- Header ---------- */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton1} >
                    <Ionicons name='log-out-outline' size={22} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsButton} >
                    <Ionicons name="settings-outline" size={22} color="#333" />
                </TouchableOpacity>
            </View>

            {/* ---------- Profile Info ---------- */}
            <View style={styles.profileHeader}>
                {/* Avatar with pink outer circle & white inner circle */}
                <View style={styles.avatarOuterCircle}>
                    <View style={styles.avatarInnerCircle}>
                        <Image
                            source={{ uri: userData?.profileImageUrl || 'https://via.placeholder.com/150' }}
                            style={styles.profileImage}
                        />
                    </View>
                </View>
                {/* User details to the right */}
                <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>
                        {userData?.name || 'Jane Doe'}
                    </Text>

                    <View style={styles.ratingContainer}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Ionicons
                                key={index}
                                name={index < userRating ? 'star' : 'star-outline'}
                                size={14}
                                color={colors.starYellow}
                                style={{ marginRight: 2 }}
                            />
                        ))}
                        <Text style={styles.reviewCount}>
                            {userReviewsCount} reviews
                        </Text>
                    </View>

                    <Text style={styles.locationText}>
                        {userData?.Studenthousing.name}
                    </Text>
                    <Text style={styles.tokensText}>
                        {userTokens} tokens
                    </Text>
                </View>
            </View>

            {/* ---------- Interests ---------- */}
            <View style={styles.interestsSection}>
                <Text style={styles.interestsTitle}>Interests</Text>
                <View style={styles.interestsList}>
                    {interests.map((interest, index) => (
                        <View style={styles.interestTag} key={index}>
                            <Text style={styles.interestTagText}>{interest}</Text>
                        </View>
                    ))}
                </View>

                {/* Edit Interests Button */}
                <TouchableOpacity style={styles.editInterestsButton}>
                    <Ionicons name="pencil-outline" size={14} color="#333" />
                    <Text style={styles.editInterestsButtonText}>Edit Interests</Text>
                </TouchableOpacity>
            </View>

            {/* ---------- Tabs ---------- */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 'Deels' && styles.tabButtonActive,
                    ]}
                    onPress={() => setActiveTab('Deels')}
                >
                    <Text
                        style={[
                            styles.tabButtonText,
                            activeTab === 'Deels' && styles.tabButtonTextActive,
                        ]}
                    >
                        My Deels
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 'saved' && styles.tabButtonActive,
                    ]}
                    onPress={() => setActiveTab('saved')}
                >
                    <Text
                        style={[
                            styles.tabButtonText,
                            activeTab === 'saved' && styles.tabButtonTextActive,
                        ]}
                    >
                        Saved
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ---------- Tab Content ---------- */}
            {activeTab === 'Deels' ? (
                <View style={styles.tabContent}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.mainPink} />
                    ) : isError ? (
                        <Text style={styles.emptyStateText}>Failed to load listings</Text>
                    ) : data && data.length > 0 ? (
                        // Two-column grid
                        <View style={styles.gridContainer}>
                            {data.map((listing) => (
                                <View style={styles.gridItem} key={listing.id}>
                                    <ProductCard product={listing} />
                                </View>
                            ))}
                        </View>
                    ) : (
                        // Empty state if no listings
                        <>
                            <Text style={styles.emptyStateText}>
                                You don&apos;t have anything added yet
                            </Text>
                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.addButtonText}>+ Add Something</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ) : (
                <View style={styles.tabContent}>
                    <Text style={styles.emptyStateText}>No items saved yet</Text>
                </View>
            )}


        </ScrollView>
    );
}

/** 
 * Adjust these to match your exact brand. 
 * No shadows or elevated backgrounds on the header for a seamless look.
 */
const colors = {
    mainPink: '#FF3C80', // main accent
    lightPink: '#FFE4F2', // highlights
    starYellow: '#FFC107',
    textDark: '#333',
    textLight: '#777',
    white: '#F8F8F8', // slightly less white
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,           // allows the content to grow & fill screen height
    },
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ---------- Header ----------
    headerContainer: {
        height: 60,


        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',

        color: colors.textDark,
    },
    settingsButton: {
        position: 'absolute',
        right: 20,

    },

    signOutButton1: {
        position: 'absolute',
        right: 50,

    },



    // ---------- Profile Header ----------



    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 20,   // spacing on left/right
    },

    avatarOuterCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: colors.mainPink,   // pink ring
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,                // space between avatar & text
    },

    avatarInnerCircle: {
        width: 84,
        height: 84,
        borderRadius: 42,
        borderWidth: 4,
        borderColor: colors.white,      // white ring
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },

    profileDetails: {
        flex: 1,
        justifyContent: 'center',       // vertically centers the text block
    },

    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
    },

    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },

    reviewCount: {
        marginLeft: 4,
        fontSize: 12,
        color: colors.textLight,
    },

    locationText: {
        fontSize: 13,
        color: colors.textLight,
        marginTop: 2,
    },

    tokensText: {
        marginTop: 2,
        fontSize: 13,
        fontWeight: '600',
        color: colors.mainPink,
    },


    // ---------- Interests ----------
    interestsSection: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    interestsTitle: {
        // make it be quite wide since the interests list take up entire width
        width: '100%',
        fontSize: 16,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 2,
        marginLeft: 8,

    },
    interestsList: {
        flexDirection: 'row',
        justifyContent: 'space-between',  // spaces out each interest evenly
        marginVertical: 8,
    },
    interestTag: {
        flex: 1,                           // let each interest expand equally
        marginHorizontal: 4,              // small horizontal gap
        backgroundColor: colors.lightPink, // or your choice
        borderRadius: 16,
        paddingVertical: 8,
        alignItems: 'center',
    },
    interestTagText: {
        fontSize: 13,
        color: colors.textDark,
    },
    editInterestsButton: {
        flexDirection: 'row',
        gap: 6,
        alignSelf: 'flex-start',          // or 'center' if you want it centered
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 6,
    },

    editInterestsButtonText: {
        fontSize: 12,
        fontWeight: '400',
        color: colors.textDark,
    },

    // ---------- Tabs ----------
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
        backgroundColor: colors.mainPink,
    },
    tabButtonText: {
        fontSize: 13,
        color: colors.textDark,
    },
    tabButtonTextActive: {
        color: colors.white,
        fontWeight: '600',
    },

    // ---------- Tab Content ----------
    tabContent: {
        flex: 1,               // let this section fill remaining space
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 25,
        borderRadius: 8,
        // Remove or reduce marginBottom if you want it truly full-height
        marginBottom: 60,
    },

    emptyStateText: {
        fontSize: 15,
        color: colors.textLight,
    },
    addButton: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: colors.mainPink,
    },
    addButtonText: {
        fontSize: 14,
        color: colors.white,
        fontWeight: '600',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // space items evenly
        // you can also add paddingHorizontal if needed
    },
    gridItem: {
        width: '48%',     // two columns, small gap
        marginBottom: 16, // spacing between rows
    },

});
