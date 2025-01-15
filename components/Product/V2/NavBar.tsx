// NavBar.tsx
import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavBarProps {
    onBack: () => void;
    onBookmark?: () => void;
    onShare?: () => void;
}

export default function NavBar({
    onBack,
    onBookmark,
    onShare,
}: NavBarProps) {
    return (
        <View style={styles.navBar}>
            {/* LEFT ICONS ROW */}
            <View style={styles.leftIconsRow}>
                <TouchableOpacity style={styles.iconCircle} onPress={onBack}>
                    <Ionicons name="arrow-back" size={25} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* RIGHT ICONS ROW (Bookmark + Share) */}
            <View style={styles.rightIconsRow}>
                {onBookmark && (
                    <TouchableOpacity
                        style={styles.iconCircle}
                        onPress={onBookmark}
                    >
                        <Ionicons name="bookmark-outline" size={25} color="#fff" />
                    </TouchableOpacity>
                )}
                {onShare && (
                    <TouchableOpacity
                        style={styles.iconCircle}
                        onPress={onShare}
                    >
                        <Ionicons name="share-outline" size={25} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 10,
        // We keep the navBar itself transparent so the image behind is visible
        backgroundColor: 'transparent',

        // Align items across the full width, with "left" and "right" sets of icons
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10, // if you want a bit of breathing room from the top
    },
    leftIconsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightIconsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3, // spacing between the icons
    },
    iconCircle: {
        // The circular bubble behind each icon
        backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent black
        borderRadius: 20,
        padding: 8,
        marginHorizontal: 4,
    },
});
