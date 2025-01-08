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

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
}

interface ChatScreenBaseProps {
    // If we already know the chatId:
    chatId?: string;

    // If we only know product & seller, we can fetch/create a chat:
    productId?: string;
    sellerId?: string;

    // If you want a custom back arrow handler (else uses router.back()):
    onBackPress?: () => void;
}

export default function ChatScreenBase({
    chatId: initialChatId,
    productId,
    sellerId,
    onBackPress,
}: ChatScreenBaseProps) {
    const { user } = useUser(); // Current logged-in user from Clerk
    const [chatId, setChatId] = useState<string | undefined>(initialChatId);

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // 1) Ensure user is loaded; if not, show a spinner or return early
    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={{ marginTop: 8 }}>Loading user...</Text>
            </View>
        );
    }

    // 2) Initialize or fetch the chat
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
            socket.emit('fetchMessages', { chatId: resolvedChatId });

            // Listen for the chat history
            socket.on('chatHistory', (chatHistory: any[]) => {
                setMessages(chatHistory);
                setLoading(false);
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
                socket.off('chatHistory');
                socket.off('error');
            }
        };
    }, [initialChatId, productId, sellerId, user]);

    // 3) Listen for new messages
    useEffect(() => {
        const handleNewMessage = (msg: any) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, []);

    // 4) Send a new message
    const sendMessage = () => {
        if (!message.trim() || !chatId || !user.id) return;

        // Emit to server
        socket.emit('sendMessage', {
            chatId,
            senderId: user.id,
            content: message,
        });

        // Optional: optimistic UI update
        const tempMsg: Message = {
            id: Date.now().toString(),
            content: message,
            senderId: user.id,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMsg]);
        setMessage('');
    };

    // 5) Loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    // 6) Render the main UI
    return (
        <KeyboardAvoidingView
            style={styles.flexContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => (onBackPress ? onBackPress() : router.back())}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chat</Text>
                <Text style={styles.headerStatus}>online</Text>
            </View>

            {/* Messages List */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isOutgoing = item.senderId === user.id;
                    return (
                        <View style={[styles.messageContainer, isOutgoing ? styles.outgoing : styles.incoming]}>
                            <Text style={styles.messageText}>{item.content}</Text>
                            <Text style={styles.timestamp}>
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

// ------------------ Styles ------------------
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

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },
    headerStatus: {
        marginLeft: 10,
        fontSize: 13,
        color: '#4CAF50',
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
        backgroundColor: '#FCE5FF', // pastel lavender
        borderTopLeftRadius: 0,     // optional bubble corner
    },
    outgoing: {
        alignSelf: 'flex-end',
        backgroundColor: '#FFD4E5', // pastel pink
        borderTopRightRadius: 0,    // optional bubble corner
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
