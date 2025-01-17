// ChatItem.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/** Example Chat data structure */
interface Member {
    userId: string;
    user: {
        name: string;
        profileImageUrl?: string;
    };
}
interface Message {
    content: string;      // could be "Deal Proposed: Beanbag ↔ Book" or normal text
    createdAt: string;
    type?: string;        // e.g. "text", "swapProposal", etc.
    isRead?: boolean;
}

interface Chat {
    id: string;
    isGroup: boolean;
    name?: string;
    members: Member[];
    messages: Message[];
    // Could also store "unreadCount" etc.
}

interface ChatItemProps {
    chat: Chat;
    currentUserId: string | undefined;
    onPress: () => void;
}

export default function ChatItem({
    chat,
    currentUserId,
    onPress,
}: ChatItemProps) {
    /* 1) Determine chat name & avatar */
    const isGroupChat = chat.isGroup;
    const otherMember = chat.members.find((m) => m.userId !== currentUserId)?.user;
    const chatName = isGroupChat
        ? chat.name || 'Unnamed Group'
        : otherMember?.name || 'Unknown User';

    /* 2) Last message content/timestamp */
    const lastMessage = chat.messages[0]?.content || 'No messages yet';
    const timestamp = chat.messages[0]?.createdAt || '';
    const timeString = timestamp
        ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    /* 3) Decide the avatar element. If group → group icon; if not → user’s image or fallback. */
    let avatarElement: React.ReactNode = null;
    if (isGroupChat) {
        avatarElement = (
            <View style={[styles.avatar, styles.avatarGroup]}>
                <Ionicons name="people" size={20} color="#555" />
            </View>
        );
    } else {
        if (otherMember?.profileImageUrl) {
            avatarElement = (
                <Image
                    source={{ uri: otherMember.profileImageUrl }}
                    style={[styles.avatar, styles.avatarImage]}
                />
            );
        } else {
            avatarElement = (
                <View style={[styles.avatar, styles.avatarFallback]}>
                    <Ionicons name="person" size={22} color="#fff" />
                </View>
            );
        }
    }

    /* 4) (Optional) Check if last message is a "swapProposal" or normal text. 
          We'll style it differently if it's a proposal. */
    const isSwapProposal = chat.messages[0]?.type === 'swapProposal';

    /* 5) (Optional) Check unread or read. 
          If you have a property like chat.messages[0].isRead or an unreadCount, 
          we can style the row or show a small dot. */
    const hasUnread = false; // placeholder: your logic for unread

    return (
        <TouchableOpacity
            style={[styles.chatItem, hasUnread && styles.chatItemUnread]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Avatar */}
            {avatarElement}

            {/* Middle content */}
            <View style={styles.chatContent}>
                {/* Chat name row */}
                <View style={styles.nameRow}>
                    <Text style={styles.chatName} numberOfLines={1}>
                        {chatName}
                    </Text>
                    {hasUnread && <View style={styles.unreadDot} />}
                </View>

                {/* Last message row */}
                <Text
                    style={[
                        styles.chatLastMessage,
                        isSwapProposal && styles.swapProposalText,
                    ]}
                    numberOfLines={1}
                >
                    {lastMessage}
                </Text>
            </View>

            {/* Timestamp */}
            <Text style={styles.chatTimestamp}>{timeString}</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomColor: '#F3F3F3',
        borderBottomWidth: 1,
        backgroundColor: '#FFF',

        // You can add "Press" feedback or highlight on touch if you like
    },
    chatItemUnread: {
        backgroundColor: '#fff8f3',
        // subtle highlight for unread row (light pastel orange?), adjust as you wish
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    avatarGroup: {
        backgroundColor: '#ffd4e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        resizeMode: 'cover',
    },
    avatarFallback: {
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },

    chatContent: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        maxWidth: '90%',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E91E63',
        marginLeft: 6,
    },
    chatLastMessage: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },
    swapProposalText: {
        fontStyle: 'italic',
        color: '#9C27B0', // brand accent color for swap proposals
    },
    chatTimestamp: {
        fontSize: 12,
        color: '#aaa',
        marginLeft: 8,
    },
});
