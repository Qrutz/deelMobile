import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import socket from '@/utils/socket';

import UpgradedHeaderChat from './UpgradedHeaderChat';
import ChatInputBar from './ChatInput';
import MessageBubble from './MessageBubble';
import { User } from '@/types';


interface ChatMember {
    userId: string;
    user: {
        id: string;
        name: string;
        profileImageUrl?: string;
    };
}

interface ChatMessage {
    id: string;
    senderId: string;
    createdAt: string;
    content: string;
    // No more "type" since we only do text
    sender: User;
}

interface ChatDetails {
    id: string;
    isGroup: boolean;
    name?: string | null;
    members: ChatMember[];
    messages: ChatMessage[];
}

interface ChatScreenBaseProps {
    chatId: string;
    onBackPress?: () => void;
}

export default function ChatScreenBase({ chatId, onBackPress }: ChatScreenBaseProps) {
    const flatListRef = useRef<FlatList>(null);
    const { user } = useUser();
    const [chatData, setChatData] = useState<ChatDetails | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    console.log(messages);

    useEffect(() => {
        if (!user) return;

        // Join & fetch messages
        socket.emit('joinChat', { chatId, userId: user.id });
        socket.emit('fetchMessages', { chatId });

        // Listen for chat details
        socket.on('chatDetails', (cd: ChatDetails) => {
            setChatData(cd);
            setMessages(cd.messages || []);
            setLoading(false);
        });

        // Listen for new text messages
        socket.on('newMessage', (msg: ChatMessage) => {
            console.log('New message:', msg);
            setMessages((prev) => [...prev, msg]);
        });

        // Listen for errors
        socket.on('error', (err: any) => {
            console.error('Socket error:', err.message);
            Alert.alert('Error', err.message);
        });

        // Cleanup when unmounting
        return () => {
            if (user) {
                socket.emit('leaveChat', { chatId, userId: user.id });
                socket.off('chatDetails');
                socket.off('newMessage');
                socket.off('error');
            }
        };
    }, [chatId, user]);

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Loading user...</Text>
            </View>
        );
    }

    const currentUserId = user.id;

    // Decide how to show header: group or 1-on-1
    let headerTitle = 'Group Chat';
    let headerAvatar = 'https://via.placeholder.com/150';
    const isGroupChat = chatData?.isGroup || false;

    // If group has a name, display it
    if (isGroupChat && chatData?.name) {
        headerTitle = chatData.name;
    }

    // If it's not a group and exactly 2 members, get the other user
    if (!isGroupChat && chatData?.members.length === 2) {
        const otherMember = chatData.members.find((m) => m.userId !== currentUserId);
        if (otherMember) {
            headerTitle = otherMember.user.name;
            headerAvatar = otherMember.user.profileImageUrl || headerAvatar;
        }
    }

    // Handle sending text messages
    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        // Emit the message
        socket.emit('sendMessage', {
            chatId,
            senderId: currentUserId,
            content: text.trim(),
        });
    };

    // Render each message bubble
    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isOutgoing = item.senderId === currentUserId;

        return (
            <MessageBubble
                content={item.content}
                isOutgoing={isOutgoing}
                senderName={item.sender.name}
                avatarUrl={item.sender.profileImageUrl!}
            />
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={45}
        >
            <UpgradedHeaderChat
                sellerName={headerTitle}
                sellerAvatar={headerAvatar}
                isOnline={true} // or real condition
                onBackPress={onBackPress}
            />

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(m) => m.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 12 }}
                onContentSizeChange={() => {
                    // Scroll to bottom when new messages arrive
                    setTimeout(() => {
                        if (messages.length > 0) {
                            // @ts-ignore
                            flatListRef.current.scrollToEnd();
                        }
                    }, 100);
                }
                }
            />

            <ChatInputBar onSendMessage={handleSendMessage} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    msgBubble: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 10,
        marginVertical: 4,
    },
    msgText: { color: '#333' },
    outgoing: {
        alignSelf: 'flex-end',
        backgroundColor: '#ffd4e5',
    },
    incoming: {
        alignSelf: 'flex-start',
        backgroundColor: '#fce5ff',
    },
});
