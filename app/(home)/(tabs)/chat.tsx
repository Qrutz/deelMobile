import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import * as Notifications from 'expo-notifications';
import socket from '@/utils/socket';
import { Ionicons } from '@expo/vector-icons';

interface Chat {
    id: string;
    isGroup: boolean;
    name?: string;
    members: Array<{
        userId: string;
        user: { name: string };
    }>;
    messages: Array<{
        content: string;
        createdAt: string;
    }>;
}

// If you want to store or fetch an avatar, adapt your interface as needed
// e.g., user: { name: string; avatarUrl?: string; }

const ChatList = () => {
    const router = useRouter();
    const { user } = useUser();

    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const notificationListener = useRef<any>();

    useEffect(() => {
        if (!user?.id) return;

        console.log('Fetching chats via socket...');
        socket.emit('fetchChats', { userId: user.id });

        socket.on('chatList', (fetchedChats: Chat[]) => {
            console.log('Chats fetched:', fetchedChats);
            setChats(fetchedChats);
            setLoading(false);
        });

        socket.on('notifyMessage', ({ chatId, content, senderName }) => {
            console.log('New message received:', { chatId, content });

            setChats((prevChats) => {
                const updatedChats = [...prevChats];
                const chatIndex = updatedChats.findIndex((chat) => chat.id === chatId);

                if (chatIndex !== -1) {
                    // Update the last message for existing chat
                    updatedChats[chatIndex] = {
                        ...updatedChats[chatIndex],
                        messages: [
                            { content, createdAt: new Date().toISOString() },
                            ...updatedChats[chatIndex].messages,
                        ],
                    };
                } else {
                    // Add a new chat if not found
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

            // Trigger local notification
            Notifications.scheduleNotificationAsync({
                content: {
                    title: `${senderName}`,
                    body: content,
                },
                trigger: null,
            });
        });

        return () => {
            socket.off('chatList');
            socket.off('notifyMessage');
        };
    }, [user?.id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    if (!chats || chats.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No chats yet. Start chatting!</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Chat }) => {
        const isGroupChat = item.isGroup;
        const chatName = isGroupChat
            ? item.name || 'Unnamed Group'
            : item.members.find((m) => m.userId !== user?.id)?.user?.name || 'Unknown User';

        const lastMessage = item.messages[0]?.content || 'No messages yet';
        const timestamp = item.messages[0]?.createdAt || '';

        // Format the time (if any)
        const timeString = timestamp
            ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

        // Optionally: if you have an avatar URL, you could pass it here
        // For now, we’ll show a placeholder avatar for group or user
        const avatarSource = isGroupChat
            ? <Ionicons name="people" size={44} color="#555" />
            : <Ionicons name="person" size={44} color="#555" />;

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => router.push(`/chat/${item.id}`)}
                activeOpacity={0.7}
            >
                {/* Avatar */}
                <View style={styles.avatar}>{avatarSource}</View>

                {/* Middle content: Name & Last Message */}
                <View style={styles.chatContent}>
                    <Text style={styles.chatName}>{chatName}</Text>
                    <Text style={styles.chatLastMessage} numberOfLines={1}>
                        {lastMessage}
                    </Text>
                </View>

                {/* Timestamp on the right */}
                <Text style={styles.chatTimestamp}>{timeString}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 8 }}
            />
        </View>
    );
};

export default ChatList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDFE', // a soft off-white
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
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomColor: '#F3F3F3',
        borderBottomWidth: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        // Optionally add a pastel background or border
        backgroundColor: '#ffd4e5',
    },
    chatContent: {
        flex: 1, // so the name/lastmessage occupies the middle
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    chatLastMessage: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },
    chatTimestamp: {
        fontSize: 12,
        color: '#aaa',
        marginLeft: 8,
    },
});
