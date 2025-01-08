import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import ChatScreen from '@/components/Chat/Chatroom';

export default function Modal() {
    const { productId, sellerId } = useLocalSearchParams(); // Get query params for product and seller
    const singleProductId = Array.isArray(productId) ? productId[0] : productId;
    const singleSellerId = Array.isArray(sellerId) ? sellerId[0] : sellerId;
    const { user } = useUser(); // Current logged-in user



    return (
        <ChatScreen isModal productId={singleProductId} sellerId={singleSellerId} />
    );
}

