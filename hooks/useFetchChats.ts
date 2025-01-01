import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

// Chat type
export interface Chat {
  id: string;
  name: string | null;
  isGroup: boolean;
  createdAt: string;
  members: { userId: string; user: { id: string; name: string } }[];
  messages: { id: string; content: string; createdAt: string }[];
}

// Fetch chats for a user
const fetchChats = async (userId: string): Promise<Chat[]> => {
  const response = await fetch(`${API_URL}/chats/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chats');
  }
  return response.json();
};

// Custom hook
export const useFetchChats = (userId: string) => {
  return useQuery<Chat[]>({
    queryKey: ['chats', userId],
    queryFn: () => fetchChats(userId),
  });
};
