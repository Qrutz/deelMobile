import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Category = {
    label: string;
    icon: string;
};

type Props = {
    categories: Category[];
    selectedCategory: string;
    onCategoryPress: (cat: string) => void;
};

export default function CategoryRow({
    categories,
    selectedCategory,
    onCategoryPress,
}: Props) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((cat) => {
                    const isActive = cat.label === selectedCategory;
                    return (
                        <TouchableOpacity
                            key={cat.label}
                            style={[styles.chip, isActive && styles.chipActive]}
                            onPress={() => onCategoryPress(cat.label)}
                        >
                            <Ionicons
                                name={cat.icon as keyof typeof Ionicons.glyphMap}
                                size={16}
                                color={isActive ? '#fff' : '#333'}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.label, isActive && styles.labelActive]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 8,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: '#4CAF50',
    },
    label: {
        fontSize: 14,
        color: '#333',
    },
    labelActive: {
        color: '#fff',
        fontWeight: '600',
    },
});
