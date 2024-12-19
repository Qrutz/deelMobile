import React from 'react';
import { Text, View, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import ProductCard from '@/components/ProductCard';
import { useFetchListings } from '@/hooks/useFetchListings';

export default function Marketplace() {
    const categories = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Accessories'];
    const { data: products, isLoading, isError } = useFetchListings();

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

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-9 bg-white shadow">
                <View>
                    <Text className="text-lg font-bold text-gray-900">Hello, User</Text>
                    <Text className="text-sm text-gray-500">Let's start shopping</Text>
                </View>
                <TouchableOpacity className="bg-gray-200 p-2 rounded-full">
                    <Text className="text-gray-700 text-lg">🔍</Text>
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <View className="h-12 bg-red-300">
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

            {/* Product Grid */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
                renderItem={({ item }) => (
                    <View className="flex-1 py-2">
                        <ProductCard product={item} />
                    </View>
                )}
            />
        </View>
    );
}
