import React from 'react';
import { Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import ProductCard from '@/components/ProductCard';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '@/components/BottomNavigation';


export default function Marketplace() {
    const categories = ['Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Accessories'];

    const products = [
        { id: '1', title: 'Wool Sweater', image: 'https://blog.tincanknits.com/wp-content/uploads/2021/01/recyclingyarntutorial-tck-0223-1024x585.jpg', price: 8 },
        { id: '2', title: 'textbook finance', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRamqFPV71D-ou9Hsg8554KxE_SNKG9UHZjrg&s', price: 10 },
        { id: '3', title: 'Keyboard', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnHCOOSh_3AKj1tCi8MPFex4KFQXaEcqjwSCL9pqZ7jQZlMhrjfUO79goKo7HMBUL4rtc&usqp=CAU', price: 20 },
        { id: '4', title: 'Stekpanna', image: 'https://i.redd.it/unmarked-no-3-skillet-need-identifying-v0-io9x6jujv1xb1.jpg?width=3120&format=pjpg&auto=webp&s=2db71c4b5c027e577be157c003f5e86971a9fd93', price: 15 },
    ];

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
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
                renderItem={({ item }) => (
                    <View className="flex-1 py-2">
                        <ProductCard product={item} />

                    </View>
                )}
            />

            {/* Bottom Navigation */}
            {/* <View className="flex-row justify-around items-center bg-white pb-8 py-3 border-t border-gray-300">
                <TouchableOpacity>
                    <Ionicons name="home" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="heart" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Ionicons name="add" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="chatbox-ellipses" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="person" size={24} color="black" />
                </TouchableOpacity>
            </View> */}


        </View>
    );
}
