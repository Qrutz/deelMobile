import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as Notifications from 'expo-notifications';
import socket from '@/utils/socket'; // Shared socket instance

interface Chat {
    id: string;
    isGroup: boolean;
    name?: string;
    members: Array<{ userId: string; user: { name: string } }>;
    messages: Array<{ content: string; createdAt: string }>;
}

const ChatList = () => {
    const router = useRouter();
    const { user } = useUser(); // Current logged-in user

    const [chats, setChats] = useState<Chat[]>([]); // State for chat list
    const [loading, setLoading] = useState(true);  // Loading state
    const notificationListener = useRef<any>();

    useEffect(() => {
        if (!user?.id) return;

        console.log('Fetching chats via socket...');
        socket.emit('fetchChats', { userId: user.id }); // Fetch chats from server

        // Receive initial chat list
        socket.on('chatList', (fetchedChats: Chat[]) => {
            console.log('Chats fetched:', fetchedChats);
            setChats(fetchedChats); // Update state with fetched chats
            setLoading(false); // Stop loading
        });

        // Handle incoming messages and dynamically update chat list
        socket.on('notifyMessage', ({ chatId, content, senderName }) => {
            console.log('New message received:', { chatId, content });

            setChats((prevChats) => {
                const updatedChats = [...prevChats];
                const chatIndex = updatedChats.findIndex((chat) => chat.id === chatId);

                if (chatIndex !== -1) {
                    // Update the last message for an existing chat
                    updatedChats[chatIndex] = {
                        ...updatedChats[chatIndex],
                        messages: [
                            { content, createdAt: new Date().toISOString() },
                            ...updatedChats[chatIndex].messages,
                        ],
                    };
                } else {
                    // Add a new chat dynamically if it doesn't exist
                    updatedChats.unshift({
                        id: chatId,
                        isGroup: false,
                        name: senderName,
                        members: [],
                        messages: [{ content, createdAt: new Date().toISOString() }],
                    });
                }

                return updatedChats;
            });

            // Trigger notification
            Notifications.scheduleNotificationAsync({
                content: {
                    title: `${senderName}`,
                    body: content,
                },
                trigger: null, // Show immediately
            });
        });

        // Cleanup on unmount
        return () => {
            socket.off('chatList');
            socket.off('notifyMessage');
        };
    }, [user?.id]);

    // Loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
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
                        ? item.name // Group chat uses building name
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
