import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

export default function CategoryRow({ categories, selectedCategory, onCategoryPress }: Props) {
    return (
        <View style={styles.categoriesContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
            >
                {categories.map((cat) => {
                    const isActive = cat.label === selectedCategory;
                    return (
                        <TouchableOpacity
                            key={cat.label}
                            style={styles.categoryItem}
                            onPress={() => onCategoryPress(cat.label)}
                        >
                            <View
                                style={[
                                    styles.iconCircle,
                                    isActive ? styles.iconCircleActive : {},
                                ]}
                            >
                                <Ionicons
                                    name={cat.icon as keyof typeof Ionicons.glyphMap}
                                    size={22}
                                    color={isActive ? '#fff' : '#333'}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.categoryLabel,
                                    isActive && styles.categoryLabelActive,
                                ]}
                            >
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
    categoriesContainer: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        marginBottom: 8,
    },
    categoryRow: {
        paddingHorizontal: 16,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 16,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleActive: {
        backgroundColor: '#4CAF50',
    },
    categoryLabel: {
        marginTop: 4,
        fontSize: 12,
        color: '#333',
    },
    categoryLabelActive: {
        fontWeight: '700',
        color: '#4CAF50',
    },
});
