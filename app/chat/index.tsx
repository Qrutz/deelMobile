import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ChatList = () => {
    const router = useRouter();

    // Sample ongoing chats
    const chats = [
        { id: '1', name: 'Anna Svensson', lastMessage: 'Hey, how are you?', timestamp: '10:30 AM' },
        { id: '2', name: 'Erik Johansson', lastMessage: 'Let me know about the deal.', timestamp: '9:45 AM' },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.chatItem}
                        onPress={() => router.push(`/chat/${item.id}`)} // Navigate to specific chat
                    >
                        <View style={styles.chatContent}>
                            <Text style={styles.chatName}>{item.name}</Text>
                            <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
                        </View>
                        <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ChatList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    chatContent: {
        flex: 1,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    chatLastMessage: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    chatTimestamp: {
        fontSize: 12,
        color: '#aaa',
    },
});
