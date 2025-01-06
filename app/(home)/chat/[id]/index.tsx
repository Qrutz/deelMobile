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
import { router, useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import socket from '@/utils/socket'; // Import shared socket instance

export default function ChatRoom() {
    const { id: chatId } = useLocalSearchParams(); // Chat ID from URL params
    const { user } = useUser(); // Current logged-in user

    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [chatName, setChatName] = useState(''); // For chat header

    // Connect to the chat room
    useEffect(() => {
        if (!user || !chatId) return;

        // Join the chat room
        socket.emit('joinChat', { chatId, userId: user.id });

        // Fetch chat details for the header (chat name)
        fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/chats/${chatId}`)
            .then((res) => res.json())
            .then((chat) =>
                setChatName(
                    chat.isGroup
                        ? chat.name
                        : chat.members.find((m: any) => m.userId !== user.id)?.user?.name || 'Unknown'
                )
            )
            .catch((err) => {
                console.error('Failed to fetch chat details:', err);
                Alert.alert('Error', 'Could not load chat details.');
            });

        // Fetch chat history
        socket.emit('fetchMessages', { chatId });

        socket.on('chatHistory', (chatHistory) => {
            const formattedMessages = chatHistory.map((msg: any) => ({
                id: msg.id,
                text: msg.content,
                sender: msg.senderId === user.id ? 'You' : 'Them',
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            }));
            setMessages(formattedMessages);
            setLoading(false);
        });

        // Listen for new messages
        const handleNewMessage = (msg: any) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: msg.id,
                    text: msg.content,
                    sender: msg.senderId === user.id ? 'You' : 'Them',
                    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                },
            ]);
        };
        socket.on('newMessage', handleNewMessage);

        // Error handling
        const handleError = (err: any) => {
            console.error('Socket Error:', err.message);
            Alert.alert('Error', 'A problem occurred while connecting to the chat.');
        };
        socket.on('error', handleError);

        // Cleanup
        return () => {
            socket.off('newMessage', handleNewMessage); // Remove event listener
            socket.off('error', handleError);
            socket.emit('leaveChat', { chatId, userId: user.id }); // Leave the chat when unmounting
        };
    }, [chatId, user?.id]);

    // Send a message
    const sendMessage = () => {
        if (message.trim()) {
            const msg = {
                chatId,
                senderId: user?.id,
                content: message,
            };
            socket.emit('sendMessage', msg); // Emit message to server
            setMessage(''); // Clear input field
        }
    };

    // Loading state
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
            keyboardVerticalOffset={55} // iOS specific offset

        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/chat')}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{chatName}</Text>
                    <Text style={styles.headerStatus}>online</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="logo-ionitron" size={24} color="#4CAF50" />
                </TouchableOpacity>
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

            {/* Input Field */}
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        elevation: 2,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerStatus: { fontSize: 14, color: '#4CAF50' },
    messageList: { flexGrow: 1, padding: 10 },
    messageContainer: {
        maxWidth: '70%',
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
    },
    incoming: { backgroundColor: '#F1F1F1', alignSelf: 'flex-start' },
    outgoing: { backgroundColor: '#4CAF50', alignSelf: 'flex-end' },
    messageText: { fontSize: 16, color: '#333' },
    timestamp: { fontSize: 12, color: '#888', marginTop: 5, alignSelf: 'flex-end' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#ddd' },
    input: { flex: 1, padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', marginRight: 10 },
    sendButton: { padding: 10, borderRadius: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
