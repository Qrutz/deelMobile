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
    const { productId, sellerId, chatId } = useLocalSearchParams(); // Get query params for product and seller
    const singleChatId = Array.isArray(chatId) ? chatId[0] : chatId;




    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ChatScreen chatId={singleChatId} />
        </SafeAreaView>

    );
}

