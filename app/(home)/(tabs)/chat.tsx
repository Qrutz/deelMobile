import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import socket from '@/utils/socket';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import ChatItem from '@/components/Chat/ListView/ChatItem';



interface Chat {
    id: string;
    isGroup: boolean;
    name?: string;
    members: Array<{
        userId: string;
        user: {
            name: string;
            profileImageUrl?: string;
        };
    }>;
    messages: Array<{
        content: string;
        createdAt: string;
    }>;
}

export default function ChatListContainer() {
    const router = useRouter();
    const { user } = useUser();

    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const notificationListener = useRef<any>(null);

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
                const updated = [...prevChats];
                const idx = updated.findIndex((c) => c.id === chatId);

                if (idx !== -1) {
                    // update the chat's last message
                    updated[idx] = {
                        ...updated[idx],
                        messages: [
                            { content, createdAt: new Date().toISOString() },
                            ...updated[idx].messages,
                        ],
                    };
                    // Move this chat to the top of the list
                    const [movedChat] = updated.splice(idx, 1);
                    updated.unshift(movedChat);
                } else {
                    // new chat altogether
                    updated.unshift({
                        id: chatId,
                        isGroup: false,
                        name: senderName,
                        members: [],
                        messages: [{ content, createdAt: new Date().toISOString() }],
                    });
                }
                return updated;
            });

            // Local notification
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
                <ActivityIndicator size="large" color="#E91E63" />
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

    const handleOpenChat = (chatId: string) => {
        router.push(`/chat/${chatId}`);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatItem
                        chat={item}
                        currentUserId={user?.id}
                        onPress={() => handleOpenChat(item.id)}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 8 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
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
});
