// NewGifPicker.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GIPHY_API_KEY = process.env.EXPO_PUBLIC_GIPHY_API_KEY

// List all tabs you want
const TABS = [
    { label: 'Trending', value: 'trending' },
    { label: 'Reactions', value: 'reactions' },
    { label: 'Animals', value: 'animals' },
    { label: 'Memes', value: 'memes' },
    { label: 'Search', value: 'search' },
];

interface NewGifPickerProps {
    onSelectGif: (gifUrl: string) => void;
    onCancel: () => void;
}

export default function NewGifPicker({ onSelectGif, onCancel }: NewGifPickerProps) {
    const [activeTab, setActiveTab] = useState('trending');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // For search tab
    const [searchQuery, setSearchQuery] = useState('');

    // 1) On mount or whenever activeTab changes (except "search"), do a fetch
    useEffect(() => {
        if (activeTab === 'search') return; // we'll fetch only when user types
        fetchGifsForTab(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // 2) If user is on "Search" tab and types
    useEffect(() => {
        if (activeTab !== 'search') return;
        if (searchQuery.trim().length === 0) {
            setResults([]); // no query => empty
            return;
        }
        const timer = setTimeout(() => {
            fetchSearchGifs(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, activeTab]);

    // Fetch logic
    const fetchGifsForTab = async (tabValue: string) => {
        try {
            setLoading(true);
            let url = '';
            if (tabValue === 'trending') {
                url = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=21`;
            } else {
                // For "reactions", "animals", "memes", we do a search with that keyword
                url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${tabValue}&limit=21`;
            }
            const resp = await fetch(url);
            const json = await resp.json();
            setResults(json.data || []);
        } catch (err) {
            console.error('Fetching gifs error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchGifs = async (query: string) => {
        try {
            setLoading(true);
            const resp = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=21`
            );
            const json = await resp.json();
            setResults(json.data || []);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectGif = (url: string) => {
        onSelectGif(url);
    };

    // Render your top tab bar
    const renderTabs = () => (
        <View style={styles.tabsContainer}>
            {TABS.map((tab) => {
                const isActive = (tab.value === activeTab);
                return (
                    <TouchableOpacity
                        key={tab.value}
                        style={[styles.tabButton, isActive && styles.tabButtonActive]}
                        onPress={() => {
                            setActiveTab(tab.value);
                            // Clear search results if switching away from search
                            if (tab.value !== 'search') setSearchQuery('');
                        }}
                    >
                        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
            {/* The "X" to close the picker */}
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Tab bar */}
                {renderTabs()}

                {/* If on search tab, show the input */}
                {activeTab === 'search' && (
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={18} color="#666" style={{ marginRight: 6 }} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search GIFs..."
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                )}

                {loading && <Text style={styles.loadingText}>Loading...</Text>}

                {/* The GIF grid */}
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
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },

    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingVertical: 4,
        paddingHorizontal: 6,
    },
    tabButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f8f8f8',
        marginRight: 6,
        borderRadius: 16,
    },
    tabButtonActive: {
        backgroundColor: '#e1bee7',
    },
    tabText: {
        fontSize: 14,
        color: '#333',
    },
    tabTextActive: {
        fontWeight: '600',
    },
    cancelButton: {
        marginLeft: 'auto',
        padding: 6,
    },

    // For search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    searchInput: {
        flex: 1,
        color: '#333',
        fontSize: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    // Loading text
    loadingText: {
        textAlign: 'center',
        marginVertical: 8,
        color: '#666',
    },

    // The GIF grid
    gifList: {
        flex: 1,
    },
    gifItem: {
        flex: 1,
        margin: 4,
        aspectRatio: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        overflow: 'hidden',
    },
    gifImage: {
        width: '100%',
        height: '100%',
    },
});
