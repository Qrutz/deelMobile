import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    visible: boolean;
    onBackPress: () => void;
    query: string;
    onChangeQuery: (q: string) => void;
};

export default function SearchBar({ visible, onBackPress, query, onChangeQuery }: Props) {
    if (!visible) return null;

    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#333"
                    onPress={onBackPress}
                    style={styles.backIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={query}
                    onChangeText={onChangeQuery}
                    autoFocus
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ededed',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    backIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        height: 36,
    },
});
