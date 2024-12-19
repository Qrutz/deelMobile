import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import ProductCard from '@/components/ProductCard';
import { useFetchListings } from '@/hooks/useFetchListings';
import { Ionicons } from '@expo/vector-icons';

export default function Marketplace() {
    const categories = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Accessories'];
    const { data: products, isLoading, isError } = useFetchListings();
    const [filterMode, setFilterMode] = useState<'building' | 'nearby'>('building'); // State to toggle proximity filters

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg font-bold text-red-500">Failed to load listings</Text>
            </View>
        );
    }

    const toggleFilterMode = () => {
        setFilterMode(filterMode === 'building' ? 'nearby' : 'building');
        Alert.alert(
            'Filter Changed',
            `Now showing ${filterMode === 'building' ? 'Nearby Listings' : 'Same Building Listings'}.`
        );
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-4 pt-12 bg-white ">
                <View>
                    <Text className="text-lg font-bold text-gray-900">Hello, User</Text>
                    <Text className="text-sm text-gray-500 mt-1">Explore {filterMode === 'building' ? 'same building deals' : 'nearby listings'}</Text>
                </View>
                <TouchableOpacity
                    className="flex-row items-center bg-gray-100 py-2 px-4 rounded-full"
                    onPress={toggleFilterMode}
                >
                    <Ionicons name="location-outline" size={16} color="black" />
                    <Text className="text-sm font-semibold text-gray-800 ml-2">
                        {filterMode === 'building' ? 'Building' : 'Nearby'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <View className="h-12">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}
                >
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            className="bg-gray-200 py-1 px-3 rounded-full mr-2"
                        >
                            <Text className="text-sm font-semibold text-gray-700">{category}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Proximity Banner */}
            <View className="bg-green-100 py-3 px-6 my-2 mx-4 rounded-lg">
                <Text className="text-sm text-gray-700">
                    {filterMode === 'building'
                        ? 'Showing listings available in your building.'
                        : 'Showing listings within 500 meters.'}
                </Text>
            </View>

            {/* Product Grid */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
                renderItem={({ item }) => (
                    <View className="flex-1 py-2">
                        <ProductCard product={{ ...item, proximity: filterMode === 'building' ? 'Same Building' : '500 meters away' }} />
                    </View>
                )}
            />
        </View>
    );
}
