import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useFetchUser } from '@/hooks/UserHooks/useGetUser';
import ProductCard from '@/components/ProductCard';

// Reusable sub-components:
import { ProfileHeader } from '@/components/Profile/ProfileHeader';
import { ProfileInterests } from '@/components/Profile/ProfileInterests';

export default function ProfilePage() {
    const { id } = useLocalSearchParams() as { id: string };
    const { data: user, isLoading, isError } = useFetchUser(id);

    // Example placeholder if user object lacks an `interests` field
    const userInterests = ['Photography', 'Cycling', 'Cooking'];

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FF3C80" />
            </View>
        );
    }

    if (isError || !user) {
        return (
            <View style={styles.centered}>
                <Text>Failed to load user profile.</Text>
            </View>
        );
    }

    // --- Define a Header Component for the FlatList ---
    const renderHeader = () => (
        <>
            {/* Custom top bar */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={22} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Profile Header (reusable) */}
            <ProfileHeader
                profileImageUrl={user.profileImageUrl || user.image || 'https://via.placeholder.com/150'}
                name={user.name || user.fullName || 'User'}
                rating={0}           // placeholder rating
                reviewsCount={0}     // placeholder reviews
                location={'N/A'}     // placeholder location
                tokens={0}           // placeholder tokens
            />

            {/* Interests (reusable) */}
            <ProfileInterests
                interests={userInterests}
                canEdit={false} // hides the "Edit Interests" button for a public profile
            />

            {/* Section Title */}
            <Text style={styles.sectionTitle}>Listings by {user.name}</Text>
        </>
    );

    // --- Render the entire screen with one FlatList ---
    return (
        <FlatList
            data={user.listings}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={() => (
                <View style={styles.centered}>
                    <Text style={styles.noListingsText}>
                        {user.name} has no listings yet.
                    </Text>
                </View>
            )}
            renderItem={({ item }) => (
                <View style={styles.gridItem}>
                    <ProductCard product={item} />
                </View>
            )}
            contentContainerStyle={{ paddingBottom: 40 }}
            style={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 20,
        marginBottom: 10,
        marginTop: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
    },
    noListingsText: {
        fontSize: 14,
        color: '#888',
        padding: 10,
    },
});
