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
import ChatScreen from '@/components/Chat/Chatroom';

export default function ChatRoomX() {
    const { id: chatId } = useLocalSearchParams(); // Chat ID from URL params




    return <ChatScreen chatId={chatId as string} />;

}
