import React, { useEffect, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFetchChats } from '../../hooks/useFetchChats';
import { useUser } from '@clerk/clerk-expo';
import * as Notifications from 'expo-notifications';
import { io } from 'socket.io-client';

// Initialize socket
const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;
const socket = io(API_URL);

const ChatList = () => {
    const router = useRouter();
    const { user } = useUser(); // Current logged-in user

    // Fetch chats using hook
    const { data: chats, isLoading, isError } = useFetchChats(user?.id || '');

    const notificationListener = useRef<any>();

    useEffect(() => {
        // Request permission for notifications
        Notifications.requestPermissionsAsync();

        // Listen for incoming notifications
        socket.on('notifyMessage', async ({ chatId, content, senderName }) => {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `${senderName} sent a message`,
                    body: content,
                },
                trigger: null, // Show immediately
            });
        });

        return () => {
            socket.off('notifyMessage'); // Cleanup socket listener
        };
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    // Error state
    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load chats. Please try again.</Text>
            </View>
        );
    }

    // Empty state
    if (!chats || chats.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No chats yet. Start chatting with sellers!</Text>
            </View>
        );
    }

    // Render chat list
    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    // Handle group vs private chat
                    const isGroupChat = item.isGroup;
                    const chatName = isGroupChat
                        ? item.name // Group chat uses the building name
                        : item.members.find((m) => m.userId !== user?.id)?.user?.name || 'Unknown User';

                    // Last message & timestamp
                    const lastMessage = item.messages[0]?.content || 'No messages yet';
                    const timestamp = item.messages[0]?.createdAt || '';

                    return (
                        <TouchableOpacity
                            style={styles.chatItem}
                            onPress={() => router.push(`/chat/${item.id}`)} // Navigate to chat
                        >
                            <View style={styles.chatContent}>
                                <Text style={styles.chatName}>{chatName}</Text>
                                <Text style={styles.chatLastMessage}>{lastMessage}</Text>
                            </View>
                            <Text style={styles.chatTimestamp}>
                                {timestamp
                                    ? new Date(timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : ''}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

export default ChatList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
    },
    chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    chatContent: {
        flex: 1,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    chatLastMessage: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    chatTimestamp: {
        fontSize: 12,
        color: '#aaa',
    },
});
