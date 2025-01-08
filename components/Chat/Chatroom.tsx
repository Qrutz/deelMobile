// ChatScreenBase.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo'; // Pulling user info from Clerk
import socket from '@/utils/socket';
import UpgradedHeaderChat from './UpgradedHeaderChat';

/* ------------------ Type Definitions ------------------ */

/** The shape of each message returned by your backend. */
interface ChatMessage {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    sender?: {
        id: string;
        name: string;
        avatarUrl?: string;
        // Add more user fields if needed
    };
}

/** The shape of each chat member, if your backend returns it. */
interface ChatMember {
    userId: string;
    user: {
        id: string;
        name: string;
        profileImageUrl?: string;
        // Add more user fields if needed
    };
}

/** The full chat details payload returned by socket `chatDetails` event. */
interface ChatDetails {
    id: string;
    members: ChatMember[];
    messages: ChatMessage[];
    // If your chat also includes product info, add that here
    // product?: { id: string; title: string; ... }
}

/* ------------------------------------------------------ */

interface ChatScreenBaseProps {
    /** If we already know the chatId: */
    chatId?: string;

    /** If we only know product & seller, we can fetch/create a chat: */
    productId?: string;
    sellerId?: string;

    /** If you want a custom back arrow handler (else uses router.back()): */
    onBackPress?: () => void;
}

export default function ChatScreenBase({
    chatId: initialChatId,
    productId,
    sellerId,
    onBackPress,
}: ChatScreenBaseProps) {
    const { user } = useUser(); // Current logged-in user from Clerk
    const [chatData, setChatData] = useState<ChatDetails | null>(null);

    const [chatId, setChatId] = useState<string | undefined>(initialChatId);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // If the user object isn't loaded yet, show a spinner
    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={{ marginTop: 8 }}>Loading user...</Text>
            </View>
        );
    }

    /* ------------------ Initialize / Fetch Chat ------------------ */
    useEffect(() => {
        const userId = user.id;

        async function initChat() {
            let resolvedChatId = initialChatId;

            // If no chatId, but productId & sellerId exist, fetch/create a new chat
            if (!resolvedChatId && productId && sellerId) {
                try {
                    const resp = await fetch(
                        `${process.env.EXPO_PUBLIC_API_BASE_URL}/chats/start`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId1: userId,
                                userId2: sellerId,
                            }),
                        }
                    );
                    const data = await resp.json();
                    if (!resp.ok) throw new Error(data.error || 'Failed to create chat');
                    resolvedChatId = data.chatId;
                } catch (error: any) {
                    console.error('Error creating/fetching chat:', error.message);
                    Alert.alert('Error', 'Could not load chat.');
                    setLoading(false);
                    return;
                }
            }

            if (!resolvedChatId) {
                console.error('No chatId or (productId & sellerId) provided!');
                setLoading(false);
                return;
            }

            setChatId(resolvedChatId);

            // Join the socket room
            socket.emit('joinChat', { chatId: resolvedChatId, userId });

            // Request the full chat details (messages, members, etc.)
            socket.emit('fetchMessages', { chatId: resolvedChatId });

            // Listen for the chat details event
            socket.on('chatDetails', (chatDetails: ChatDetails) => {
                console.log('Chat details:', chatDetails);
                // Update your messages from the returned details
                setChatData(chatDetails);
                setMessages(chatDetails.messages || []);

                setLoading(false);
                // If you want, you can store chatDetails in state
                // to get other info (like members or product).
                // e.g. setChatDetails(chatDetails);
            });

            // Listen for socket errors
            socket.on('error', (err: any) => {
                console.error('Socket error:', err.message);
                Alert.alert('Error', err.message);
            });
        }

        initChat();

        // Cleanup when unmounting
        return () => {
            if (chatId) {
                socket.emit('leaveChat', { chatId, userId });
                socket.off('chatDetails');
                socket.off('error');
            }
        };
    }, [initialChatId, productId, sellerId, user]);

    /* ------------------ Listen for new messages ------------------ */
    useEffect(() => {
        const handleNewMessage = (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, []);

    /* ------------------ Send a new message ------------------ */
    const sendMessage = () => {
        if (!message.trim() || !chatId || !user.id) return;

        // Emit to server
        socket.emit('sendMessage', {
            chatId,
            senderId: user.id,
            content: message,
        });

        // // Optional: optimistic UI update
        // const tempMsg: ChatMessage = {
        //     id: Date.now().toString(),
        //     content: message,
        //     senderId: user.id,
        //     createdAt: new Date().toISOString(),
        // };
        // setMessages((prev) => [...prev, tempMsg]);
        setMessage('');
    };

    /* ------------------ Loading State ------------------ */
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    /* ------------------ Render the main UI ------------------ */
    return (
        <KeyboardAvoidingView
            style={styles.flexContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Use your upgraded chat header */}
            <UpgradedHeaderChat
                sellerName={chatData?.members[1].user.name || 'https://via.placeholder.com/150'}
                sellerAvatar={chatData?.members[1].user.profileImageUrl || 'https://via.placeholder.com/150'}    // or an actual URL
                isOnline={true}            // or a real condition
                onBackPress={onBackPress}
            />

            {/* Messages List */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isOutgoing = item.senderId === user.id;
                    return (
                        <View
                            style={[
                                styles.messageContainer,
                                isOutgoing ? styles.outgoing : styles.incoming,
                            ]}
                        >
                            <Text style={styles.messageText}>{item.content}</Text>
                            <Text style={styles.timestamp}>
                                {new Date(item.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    );
                }}
                contentContainerStyle={styles.messageList}
            />

            {/* Input Row */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="#4CAF50" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

/* ------------------ Styles ------------------ */
const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Messages
    messageList: {
        flexGrow: 1,
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    messageContainer: {
        maxWidth: '75%',
        marginVertical: 6,
        padding: 10,
        borderRadius: 12,
    },
    incoming: {
        alignSelf: 'flex-start',
        backgroundColor: '#FCE5FF',
        borderTopLeftRadius: 0, // optional bubble corner
    },
    outgoing: {
        alignSelf: 'flex-end',
        backgroundColor: '#FFD4E5',
        borderTopRightRadius: 0, // optional bubble corner
    },
    messageText: {
        fontSize: 15,
        color: '#333',
    },
    timestamp: {
        fontSize: 11,
        color: '#888',
        marginTop: 4,
        alignSelf: 'flex-end',
    },

    // Input row
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#FFF',
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 14,
        color: '#333',
    },
    sendButton: {
        padding: 8,
    },
});
