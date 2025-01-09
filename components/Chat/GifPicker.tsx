// GifPicker.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GifPickerProps {
    onSelectGif: (gifUrl: string) => void;
    onCancel: () => void;
}

const GIPHY_API_KEY = process.env.EXPO_PUBLIC_GIPHY_API_KEY

// Sample categories to mimic a Discord-like style:
const CATEGORY_PRESETS = [
    { label: 'Trending', value: '' }, // empty => trending
    { label: 'Reactions', value: 'reactions' },
    { label: 'Animals', value: 'animals' },
    { label: 'Memes', value: 'memes' },
    // Add more if you like...
];

export default function GifPicker({ onSelectGif, onCancel }: GifPickerProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // On mount or whenever `query` changes, fetch either trending or search
    useEffect(() => {
        if (query === '') {
            fetchTrending();
        } else {
            fetchSearch(query);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const fetchTrending = async () => {
        try {
            setLoading(true);
            const resp = await fetch(
                `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=21`
            );
            const json = await resp.json();
            setResults(json.data || []);
        } catch (error) {
            console.error('GIF trending error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSearch = async (searchTerm: string) => {
        if (!searchTerm.trim()) return;
        try {
            setLoading(true);
            const resp = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=21`
            );
            const json = await resp.json();
            setResults(json.data || []);
        } catch (error) {
            console.error('GIF search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectGif = (gifUrl: string) => {
        onSelectGif(gifUrl);
    };

    const handleCategoryPress = (value: string) => {
        // If empty => trending, else do a search
        setQuery(value);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Main container fills the rest of the area */}
            <View style={styles.container}>

                {/* Search Row */}
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search GIFs..."
                        value={query}
                        onChangeText={setQuery}
                    />
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Category Tabs (horizontal scroll) */}
                <ScrollView
                    horizontal
                    style={styles.categoryRow}
                    showsHorizontalScrollIndicator={false}
                >
                    {CATEGORY_PRESETS.map((cat) => {
                        const isActive = query === cat.value;
                        return (
                            <TouchableOpacity
                                key={cat.label}
                                style={[
                                    styles.categoryButton,
                                    isActive && styles.categoryButtonActive,
                                ]}
                                onPress={() => handleCategoryPress(cat.value)}
                            >
                                <Text
                                    style={[
                                        styles.categoryLabel,
                                        isActive && styles.categoryLabelActive,
                                    ]}
                                    numberOfLines={1}
                                    ellipsizeMode="clip"
                                >
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {loading && <Text style={styles.loadingText}>Loading...</Text>}

                {/* GIF Grid (3-column) */}
                <FlatList
                    style={styles.gifList}
                    data={results}
                    numColumns={3}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const imageUrl = item.images?.fixed_height_small?.url;
                        return (
                            <TouchableOpacity
                                style={styles.gifItem}
                                onPress={() => handleSelectGif(imageUrl)}
                            >
                                <Image
                                    source={{ uri: imageUrl }}
                                    style={styles.gifImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
    safeArea: {
        flex: 1, // ensures the entire screen is used inside SafeArea
        backgroundColor: '#fff',
    },
    container: {
        flex: 1, // fill leftover space below the SafeArea
        backgroundColor: '#fff',
    },

    // Search Row
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        color: '#333',
    },
    cancelButton: {
        marginLeft: 8,
        padding: 6,
    },

    // Category Row
    categoryRow: {
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingVertical: 8,
        paddingLeft: 8,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginRight: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryButtonActive: {
        backgroundColor: '#e1bee7',
    },
    categoryLabel: {
        fontSize: 16,
        color: '#000',
    },
    categoryLabelActive: {
        fontWeight: '600',
        color: '#333',
    },

    // Loading text
    loadingText: {
        textAlign: 'center',
        marginVertical: 8,
        color: '#666',
    },

    // GIF grid
    gifList: {
        flex: 1,
    },
    gifItem: {
        flex: 1,
        margin: 4,
        aspectRatio: 1, // squares
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    gifImage: {
        width: '100%',
        height: '100%',

    },
});
