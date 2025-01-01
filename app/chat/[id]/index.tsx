import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { io } from 'socket.io-client';
import { useUser } from '@clerk/clerk-expo';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!; // Backend URL
const socket = io(API_URL); // Initialize socket connection

export default function ChatRoom() {
    const { id: chatId } = useLocalSearchParams(); // Chat ID from URL params
    const { user } = useUser(); // Current logged-in user

    const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Connect to the chat room
    useEffect(() => {
        if (!user || !chatId) return;

        // Join the chat room
        socket.emit('joinChat', { chatId, userId: user.id });

        // Listen for new messages
        socket.on('newMessage', (msg) => {
            setMessages((prev) => [
                ...prev,
                { id: msg.id, text: msg.content, sender: msg.senderId === user.id ? 'You' : 'Them' },
            ]);
        });

        // Fetch existing messages when joining
        socket.emit('fetchMessages', { chatId });

        socket.on('chatHistory', (chatHistory) => {
            const formattedMessages = chatHistory.map((msg: any) => ({
                id: msg.id,
                text: msg.content,
                sender: msg.senderId === user.id ? 'You' : 'Them',
            }));
            setMessages(formattedMessages);
            setLoading(false);
        });

        // Handle errors
        socket.on('error', (err) => {
            console.error('Socket Error:', err.message);
        });

        return () => {
            socket.disconnect(); // Clean up socket connection
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Message List */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text
                        style={[
                            styles.message,
                            item.sender === 'You' ? styles.outgoing : styles.incoming,
                        ]}
                    >
                        {item.text}
                    </Text>
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
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageList: { flexGrow: 1, justifyContent: 'flex-end' },
    message: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        maxWidth: '70%',
    },
    incoming: { backgroundColor: '#f0f0f0', alignSelf: 'flex-start' },
    outgoing: { backgroundColor: '#007bff', color: 'white', alignSelf: 'flex-end' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ddd' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginRight: 5 },
});
