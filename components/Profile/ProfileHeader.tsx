import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    profileImageUrl: string | null;
    name: string;
    rating: number;          // e.g., 0-5
    reviewsCount: number;
    location: string;
    tokens: number;
}

export function ProfileHeader({
    profileImageUrl,
    name,
    rating,
    reviewsCount,
    location,
    tokens,
}: Props) {
    return (
        <View style={styles.profileHeader}>
            {/* Avatar */}
            <View style={styles.avatarOuterCircle}>
                <View style={styles.avatarInnerCircle}>
                    <Image
                        source={{ uri: profileImageUrl || 'https://via.placeholder.com/150' }}
                        style={styles.profileImage}
                    />
                </View>
            </View>

            {/* User Details */}
            <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{name}</Text>

                {/* Rating & Reviews */}
                <View style={styles.ratingContainer}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Ionicons
                            key={index}
                            name={index < rating ? 'star' : 'star-outline'}
                            size={14}
                            color="#FFC107"
                            style={{ marginRight: 2 }}
                        />
                    ))}
                    <Text style={styles.reviewCount}>{reviewsCount} reviews</Text>
                </View>

                <Text style={styles.locationText}>{location}</Text>
                <Text style={styles.tokensText}>{tokens} tokens</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    avatarOuterCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: '#FF3C80', // mainPink
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarInnerCircle: {
        width: 84,
        height: 84,
        borderRadius: 42,
        borderWidth: 4,
        borderColor: '#FFF', // white ring
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
        justifyContent: 'center',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    reviewCount: {
        marginLeft: 4,
        fontSize: 12,
        color: '#777',
    },
    locationText: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    tokensText: {
        marginTop: 2,
        fontSize: 13,
        fontWeight: '600',
        color: '#FF3C80', // mainPink
    },
});
