import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useNavigation, useRouter } from 'expo-router';
import { Image } from 'expo-image';

export default function ProfilePage() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { user } = useUser();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (err) {
            console.log('Error signing out:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Card as Header (Full-Width, Plain White Card) */}
                <TouchableOpacity style={styles.profileCard}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: user?.imageUrl }}
                            style={styles.avatar}
                        />
                    </View>
                    <View style={styles.profileTextWrapper}>
                        <Text style={styles.profileName}>{user?.firstName ?? 'User'}</Text>
                        <View
                            style={styles.profileLinkRow}
                        >
                            <Text style={styles.viewProfileLink}>View my profile</Text>
                            <View style={styles.spacer} />

                        </View>
                    </View>
                </TouchableOpacity>

                {/* Promotional Banner (with horizontal margin) */}
                <View style={styles.promoBanner}>
                    <Text style={styles.promoTitle}>Sell an item!</Text>
                    <Text style={styles.promoSubtitle}>
                        Make money on things you don’t need.
                        Help fellow students save on essentials.
                    </Text>
                    <TouchableOpacity
                        style={styles.promoButton}
                        onPress={() => router.push('/modaltest')}
                    >
                        <Text style={styles.promoButtonText}>Start Selling</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Menu Section (Full-Width) */}
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="wallet-outline"
                        title="Wallet"
                        subtitle="IDR 300.000"
                        onPress={() => router.push('/profile/wallet')}
                    />
                    <MenuItem
                        disabled
                        icon="receipt-outline"
                        title="My Orders"

                    />
                    <MenuItem
                        disabled
                        icon="heart-outline"
                        title="Favorite"

                    />
                </View>

                {/* Support & Settings Section (Full-Width) */}
                <View style={styles.menuSection}>
                    <MenuItem
                        disabled
                        icon="help-circle-outline"
                        title="Help Center"

                    />
                    <MenuItem
                        disabled
                        icon="star-outline"
                        title="Rate our application"

                    />
                    <MenuItem
                        disabled
                        icon="settings-outline"
                        title="Settings"

                    />
                </View>

                {/* About & Log Out Section (Full-Width) */}
                <View style={styles.menuSection}>
                    <MenuItem
                        disabled
                        icon="information-circle-outline"
                        title="About"

                    />
                    <MenuItem
                        icon="log-out-outline"
                        title="Log Out"
                        titleStyle={{ color: '#FF3C80' }}
                        onPress={handleSignOut}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* Reusable Menu Item Component */
interface MenuItemProps {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    titleStyle?: object;
    disabled?: boolean;
}

function MenuItem({ icon, title, subtitle, onPress, titleStyle, disabled }: MenuItemProps) {
    return (
        <TouchableOpacity
            style={[styles.menuItem, disabled && { opacity: 0.5 }]}
            onPress={!disabled ? onPress : undefined}
            disabled={disabled}
        >
            <Ionicons name={icon as any} size={24} color="#333" style={styles.menuIcon} />
            <View style={{ flex: 1 }}>
                <Text style={[styles.menuTitle, titleStyle]}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons
                name="chevron-forward"
                size={20}
                color="#999"
                style={{ marginLeft: 8 }}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    scrollContent: {
        paddingBottom: 90,
    },
    /* Profile Card (Header) - Full Width */
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        // Optional shadow for a modern look
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    avatarWrapper: {
        marginRight: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ccc',
    },
    profileTextWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    /* Updated profileLinkRow with a spacer */
    profileLinkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    viewProfileLink: {
        color: '#777',
        fontSize: 14,
    },
    spacer: {
        flex: 1,
    },
    /* Promotional Banner (Keeps Margin) */
    promoBanner: {
        backgroundColor: '#FFEBF2',
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 12,
        padding: 24,
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    promoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FF3C80',
        marginBottom: 6,
    },
    promoSubtitle: {
        fontSize: 14,
        color: '#333',
        marginBottom: 16,
        lineHeight: 20,
    },
    promoButton: {
        backgroundColor: '#FF3C80',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    promoButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    /* Menu Sections - Full Width */
    menuSection: {
        backgroundColor: '#fff',
        borderRadius: 0,
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuIcon: {
        marginRight: 16,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#777',
    },
});
