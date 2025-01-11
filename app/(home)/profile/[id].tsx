import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFetchUser } from '@/hooks/UserHooks/useGetUser';
import ProductCard from '@/components/ProductCard';

// Reusable sub-components:
import { ProfileHeader } from '@/components/Profile/ProfileHeader';
import { ProfileInterests } from '@/components/Profile/ProfileInterests';


export default function ProfilePage() {
    const { id } = useLocalSearchParams() as { id: string };
    const { data: user, isLoading, isError } = useFetchUser(id);

    // You could define a placeholder interests array
    // if your user object doesn't have an `interests` field yet
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

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Profile Header (reusable) */}
            <ProfileHeader
                profileImageUrl={
                    user.profileImageUrl || // if present
                    user.image ||           // fallback to user.image
                    'https://via.placeholder.com/150'
                }
                name={user.name || user.fullName || 'User'}
                rating={0}           // placeholder rating
                reviewsCount={0}     // placeholder reviews
                location={'N/A'}     // placeholder location
                tokens={0}           // placeholder tokens
            />

            {/* Interests (reusable) 
          - Since this might be a "public" profile, no "Edit" button:
      */}
            <ProfileInterests
                interests={userInterests}
                canEdit={false}               // hides the "Edit Interests" button
            />

            {/* Listings Grid */}
            <Text style={styles.sectionTitle}>Listings by {user.name}</Text>
            {user.listings && user.listings.length > 0 ? (
                <FlatList
                    data={user.listings}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2} // Two-column grid
                    columnWrapperStyle={styles.columnWrapper}
                    renderItem={({ item }) => (
                        <View style={styles.gridItem}>
                            <ProductCard product={item} />
                        </View>
                    )}
                />
            ) : (
                <View style={styles.centered}>
                    <Text style={styles.noListingsText}>
                        {user.name} has no listings yet.
                    </Text>
                </View>
            )}
        </ScrollView>
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
