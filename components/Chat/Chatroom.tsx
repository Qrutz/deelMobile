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
import { useLocalSearchParams, router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import socket from '@/utils/socket';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatScreenProps {
    chatId?: string; // Optional for static routes
    productId?: string;
    sellerId?: string;
    isModal?: boolean; // For layout differences
}

interface Message {
    id: string;
    content: string;
    name: string;
    sender: {
        senderId: string;
        name: string;
    };
    createdAt: string;
}

export default function ChatScreen({
    chatId: externalChatId,
    productId,
    sellerId,
    isModal = false,
}: ChatScreenProps) {
    const { id: routeChatId } = useLocalSearchParams();
    const resolvedRouteChatId = Array.isArray(routeChatId) ? routeChatId[0] : routeChatId; // Ensure it's a string
    const { user } = useUser();

    const [chatId, setChatId] = useState<string | null>(externalChatId || resolvedRouteChatId || null);

    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [chatName, setChatName] = useState('');

    useEffect(() => {
        console.log('Product ID:', productId, 'Seller ID:', sellerId, 'Chat ID:', chatId);

        if (!user) {
            console.error('No user logged in.');
            return;
        }

        const initializeChat = async () => {
            try {
                let resolvedChatId = chatId;

                console.log('Resolved chat ID:', resolvedChatId);

                // Create or fetch chat if not provided
                if (!resolvedChatId && productId && sellerId) {
                    const response = await fetch(
                        `${process.env.EXPO_PUBLIC_API_BASE_URL}/chats/start`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId1: user.id,
                                userId2: sellerId,
                            }),
                        }
                    );
                    console.log('Chat creation response:', response);
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || 'Failed to fetch chat');
                    resolvedChatId = data.chatId;
                    setChatId(resolvedChatId); // Update state
                }

                // Connect to socket
                socket.emit('joinChat', { chatId: resolvedChatId, userId: user.id });
                socket.emit('fetchMessages', { chatId: resolvedChatId });

                socket.on('chatHistory', (chatHistory) => {
                    const formattedMessages = chatHistory.map((msg: any) => ({
                        id: msg.id,
                        text: msg.content, // Use content instead of missing text
                        sender: msg.senderId === user.id ? 'You' : 'Them',
                        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                    }));
                    setMessages(formattedMessages);
                    setLoading(false);
                });


                socket.on('error', (err) => {
                    console.error('Socket error:', err.message);
                });
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Chat initialization error:', error.message);
                } else {
                    console.error('Chat initialization error:', error);
                }
                Alert.alert('Error', 'Could not load chat.');
            }
        };

        initializeChat();

        return () => {
            if (chatId) {
                socket.emit('leaveChat', { chatId, userId: user.id });
                socket.off('chatHistory');
                socket.off('error');
            }
        };
    }, [chatId, productId, sellerId, user]);

    const sendMessage = () => {
        if (message.trim()) {
            const tempId = Date.now().toString(); // Temporary ID for optimistic update

            // Optimistically add the message
            const tempMessage = {
                id: tempId,
                text: message,
                sender: 'You',
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                pending: true, // Mark as pending
            };

            setMessages((prev) => [...prev, tempMessage]);

            // Emit the message to the server
            socket.emit('sendMessage', {
                chatId,
                senderId: user?.id,
                content: message,
            });

            setMessage(''); // Clear input field
        }
    };

    // Listen for new messages globally
    useEffect(() => {
        const handleNewMessage = (msg: Message) => {
            console.log('New message received:', msg);

            if (!msg.content) {
                console.error('Received message with missing content:', msg);
                return; // Skip messages with no content
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: msg.id,
                    text: msg.content, // Map `content` to `text`
                    sender: msg.sender.senderId === user?.id ? 'You' : 'Them',
                    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                },
            ]);
        };


        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, []);

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, isModal && styles.modalContainer]} edges={isModal ? ['top'] : undefined}>
            <KeyboardAvoidingView
                style={styles.flexContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>{chatName || 'Chat'}</Text>
                        <Text style={styles.headerStatus}>online</Text>
                    </View>
                </View>

                {/* Messages */}
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.messageContainer,
                                item.sender === 'You' ? styles.outgoing : styles.incoming,
                            ]}
                        >
                            <Text style={styles.messageText}>{item.text}</Text>
                            <Text style={styles.timestamp}>{item.timestamp}</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.messageList}
                />

                {/* Input */}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    modalContainer: { borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
    flexContainer: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    messageList: { flexGrow: 1, padding: 10 },
    incoming: { backgroundColor: '#F1F1F1', alignSelf: 'flex-start' },
    outgoing: { backgroundColor: '#4CAF50', alignSelf: 'flex-end' },
    inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#ddd' },
    input: { flex: 1, padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
    sendButton: { padding: 10 },
    messageContainer: { maxWidth: '70%', marginVertical: 5, padding: 10, borderRadius: 10 },
    messageText: { fontSize: 16, color: '#333' },
    timestamp: { fontSize: 12, color: '#888', marginTop: 5, alignSelf: 'flex-end' },
    headerStatus: { fontSize: 14, color: '#4CAF50' },
});
