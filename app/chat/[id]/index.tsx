import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

export default function ChatRoom() {
    const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message.trim()) {
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), text: message, sender: 'You' },
            ]);
            setMessage('');
        }
    };

    return (
        <View style={styles.container}>
            {/* Message List */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={[styles.message, item.sender === 'You' ? styles.outgoing : styles.incoming]}>
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
