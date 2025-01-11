import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
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

            setChats(prevChats => {
                const updatedChats = [...prevChats];
                const chatIndex = updatedChats.findIndex(c => c.id === chatId);

                if (chatIndex !== -1) {
                    // update the last message for existing chat
                    updatedChats[chatIndex] = {
                        ...updatedChats[chatIndex],
                        messages: [
                            { content, createdAt: new Date().toISOString() },
                            ...updatedChats[chatIndex].messages,
                        ],
                    };
                } else {
                    // add a new chat if not found
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

    const renderItem = ({ item }: { item: Chat }) => {
        const isGroupChat = item.isGroup;
        const otherMember = item.members.find(m => m.userId !== user?.id)?.user;

        // Chat name: group name or the other user’s name
        const chatName = isGroupChat
            ? item.name || 'Unnamed Group'
            : otherMember?.name || 'Unknown User';

        // Last message & timestamp
        const lastMessage = item.messages[0]?.content || 'No messages yet';
        const timestamp = item.messages[0]?.createdAt || '';
        const timeString = timestamp
            ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

        // Decide the avatar:
        // If group, show an Ionicon. If 1-on-1, show user’s profileImageUrl or a placeholder.
        let avatarElement: React.ReactNode = null;
        if (isGroupChat) {
            avatarElement = (
                <View style={[styles.avatar, styles.avatarGroup]}>
                    <Ionicons name="people" size={20} color="#555" />
                </View>
            );
        } else {
            // private chat
            if (otherMember?.profileImageUrl) {
                avatarElement = (
                    <Image
                        source={{ uri: otherMember.profileImageUrl }}
                        style={[styles.avatar, styles.avatarImage]}
                    />
                );
            } else {
                // fallback avatar
                avatarElement = (
                    <View style={[styles.avatar, styles.avatarFallback]}>
                        <Ionicons name="person" size={22} color="#fff" />
                    </View>
                );
            }
        }

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => router.push(`/chat/${item.id}`)}
                activeOpacity={0.7}
            >
                {/* Avatar */}
                {avatarElement}

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
                keyExtractor={item => item.id}
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
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomColor: '#F3F3F3',
        borderBottomWidth: 1,
    },
    /* Avatar container variations */
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    avatarGroup: {
        backgroundColor: '#ffd4e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        resizeMode: 'cover',
    },
    avatarFallback: {
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },

    chatContent: {
        flex: 1, // so name/lastmessage occupies the middle
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
