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
import { Listing, User } from '@/types';

interface ChatMember {
    userId: string;
    user: {
        id: string;
        name: string;
        profileImageUrl?: string;
    };
}

interface Swap {
    id: string;
    listingAId?: { id: number; title: string };
    listingBId?: { id: number; title: string };
    ListingA: Listing;
    ListingB: Listing;
    status?: string; // "pending" | "accepted" etc.
}

interface ChatMessage {
    id: string;
    senderId: string;
    createdAt: string;
    content: string;
    sender: User;
    type: 'text' | 'gif' | 'productCard' | 'swapProposal';
    swap?: Swap;
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

        // Listen for new messages
        socket.on('newMessage', (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        });

        // Listen for swap updates
        socket.on('swapUpdated', (updatedSwap: Swap) => {
            console.log('Swap updated:', updatedSwap);
            // 1) Find the message whose swapId matches updatedSwap.id
            // 2) Update that message's swap.status
            setMessages((prev) =>
                prev.map((m) => {
                    if (m.type === 'swapProposal' && m.swap && m.swap.id === updatedSwap.id) {
                        return {
                            ...m,
                            swap: {
                                ...m.swap,
                                status: updatedSwap.status,
                            },
                        };
                    }
                    return m;
                })
            );
        });

        // Listen for errors
        socket.on('error', (err: any) => {
            console.error('Socket error:', err.message);
            Alert.alert('Error', err.message);
        });

        // Cleanup
        return () => {
            if (user) {
                socket.emit('leaveChat', { chatId, userId: user.id });
                socket.off('chatDetails');
                socket.off('newMessage');
                socket.off('swapUpdated');
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

    // Decide how to show the header
    let headerTitle = 'Group Chat';
    let headerAvatar = 'https://via.placeholder.com/150';
    const isGroupChat = chatData?.isGroup || false;

    if (isGroupChat && chatData?.name) {
        headerTitle = chatData.name;
    } else if (!isGroupChat && chatData?.members.length === 2) {
        const otherMember = chatData.members.find((m) => m.userId !== currentUserId);
        if (otherMember) {
            headerTitle = otherMember.user.name;
            headerAvatar = otherMember.user.profileImageUrl || headerAvatar;
        }
    }

    // Handle sending normal text / GIF
    const handleSendMessage = (text: string, type: 'text' | 'gif') => {
        if (!text.trim()) return;
        socket.emit('sendMessage', {
            chatId,
            senderId: currentUserId,
            content: text.trim(),
            type,
        });
    };

    // Handle Accept Swap
    const handleAcceptSwap = (swapId?: string) => {
        if (!swapId) return;
        // You must include userId, chatId, etc. depending on your server logic
        socket.emit('acceptSwap', {
            swapId,
            userId: currentUserId,
            chatId,
        });
    };

    // Handle Decline Swap
    const handleDeclineSwap = (swapId?: string) => {
        if (!swapId) return;
        socket.emit('declineSwap', {
            swapId,
            userId: currentUserId,
            chatId,
        });
    };

    // Render each message
    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isOutgoing = item.senderId === currentUserId;

        switch (item.type) {
            case 'productCard': {
                let productData: any;
                try {
                    productData = JSON.parse(item.content);
                } catch {
                    productData = {};
                }
                return (
                    <MessageBubble
                        isOutgoing={isOutgoing}
                        type="productCard"
                        productData={productData}
                        senderName={item.sender.name}
                        avatarUrl={item.sender.profileImageUrl || ''}
                    />
                );
            }
            case 'gif': {
                return (
                    <MessageBubble
                        isOutgoing={isOutgoing}
                        type="gif"
                        content={item.content}
                        senderName={item.sender.name}
                        avatarUrl={item.sender.profileImageUrl || ''}
                    />
                );
            }
            case 'swapProposal': {
                // We'll pass item.swap, along with accept/decline callbacks
                return (
                    <MessageBubble
                        isOutgoing={isOutgoing}
                        type="swapProposal"
                        swapData={item.swap!}
                        senderName={item.sender.name}
                        avatarUrl={item.sender.profileImageUrl || ''}
                        onAcceptSwap={() => handleAcceptSwap(item.swap?.id)}
                        onDeclineSwap={() => handleDeclineSwap(item.swap?.id)}
                    />
                );
            }
            default:
                // normal text
                return (
                    <MessageBubble
                        isOutgoing={isOutgoing}
                        type="text"
                        content={item.content}
                        senderName={item.sender.name}
                        avatarUrl={item.sender.profileImageUrl || ''}
                    />
                );
        }
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
                isOnline={true} // or real logic
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
                            flatListRef.current?.scrollToEnd();
                        }
                    }, 100);
                }}
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
});
