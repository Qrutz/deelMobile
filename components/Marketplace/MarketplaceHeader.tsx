import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useGlowAnimation from '@/hooks/useGlowAnimation';


type Props = {
    onSearchIconPress: () => void;
    onLightningPress: () => void;
};

export default function MarketplaceHeader({ onSearchIconPress, onLightningPress }: Props) {
    const { glowScale, glowOpacity } = useGlowAnimation();

    return (
        <View style={styles.header}>
            <Image
                source={require('@/assets/logo.png')}
                style={{ width: 60, height: 40 }}
                resizeMode='contain'
            />

            <View style={styles.headerRight}>
                {/* Glow Icon + Map link */}
                <TouchableOpacity onPress={onLightningPress} style={styles.iconButton}>
                    <View style={styles.glowIconWrapper}>
                        <Animated.View
                            style={[
                                styles.glowCircle,
                                {
                                    transform: [{ scale: glowScale }],
                                    opacity: glowOpacity,
                                },
                            ]}
                        />
                        <Ionicons name="map" size={24} color="#333" />
                    </View>
                </TouchableOpacity>

                {/* Search icon toggles the search bar */}
                <TouchableOpacity onPress={onSearchIconPress} style={styles.iconButton}>
                    <Ionicons name="search" size={24} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    iconButton: {
        marginLeft: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    glowIconWrapper: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowCircle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 201, 0, 0.65)',
        zIndex: -1,
    },
});
