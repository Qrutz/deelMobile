import React from 'react';
import { Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import ProductCard from '@/components/ProductCard';

export default function Marketplace() {
    const categories = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Accessories'];

    const products = [
        { id: '1', title: 'Wool Sweater', image: 'https://via.placeholder.com/150', price: 8 },
        { id: '2', title: 'Goat Wool Sweater', image: 'https://via.placeholder.com/150', price: 10 },
        { id: '3', title: 'Boots', image: 'https://via.placeholder.com/150', price: 20 },
        { id: '4', title: 'Backpack', image: 'https://via.placeholder.com/150', price: 15 },
    ];

    return (
        <View className="flex-1 bg-gray-400">
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
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
                renderItem={({ item }) => (
                    <View className="flex-1 p-2">
                        <Text>{item.title}</Text>
                    </View>
                )}
            />

            {/* Bottom Navigation */}
            <View className="flex-row justify-around items-center bg-white py-3 border-t border-gray-300">
                <TouchableOpacity>
                    <Text className="text-gray-700 text-lg">🏠</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className="text-gray-700 text-lg">❤️</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-pink w-12 h-12 rounded-full flex items-center justify-center">
                    <Text className="text-white text-2xl font-bold">+</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className="text-gray-700 text-lg">💬</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text className="text-gray-700 text-lg">👤</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
