import React from 'react';

import { router, useLocalSearchParams } from 'expo-router';

import ChatScreen from '@/components/Chat/Chatroom';

export default function ChatRoomX() {
    const { id: chatId } = useLocalSearchParams(); // Chat ID from URL params




    return <ChatScreen chatId={chatId as string} />;

}
