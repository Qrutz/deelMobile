import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import ProductCard from '@/components/ProductCard';
import { useFetchListings } from '@/hooks/ListingHooks/useFetchListings';
import { Ionicons } from '@expo/vector-icons';

export default function Marketplace() {
    const categories = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Accessories'];
    const { data: products, isLoading, isError } = useFetchListings();
    const [filterMode, setFilterMode] = useState<'building' | 'nearby'>('building');

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (isError) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}>Failed to load listings</Text>
            </View>
        );
    }

    const toggleFilterMode = () => {
        setFilterMode(filterMode === 'building' ? 'nearby' : 'building');
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Header */}
            <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Hello, Johan</Text>
                        <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                            Explore {filterMode === 'building' ? 'same building deals' : 'nearby listings'}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={toggleFilterMode} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-outline" size={16} color="black" />
                        <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: 'bold' }}>
                            {filterMode === 'building' ? 'Building' : 'Nearby'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 8 }}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{ backgroundColor: '#EEE', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16, marginRight: 8 }}
                    >
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#555' }}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Product Grid */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={{ padding: 10 }}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, padding: 8 }}>
                        <ProductCard product={{ ...item, proximity: filterMode === 'building' ? 'Same Building' : '500 meters away' }} />
                    </View>
                )}
            />
        </View>
    );
}
