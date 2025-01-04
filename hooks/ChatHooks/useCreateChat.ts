import { useMutation } from '@tanstack/react-query';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

// Chat Type
export interface Chat {
  id: string;
  isGroup: boolean;
  createdAt: string;
  members: { userId: string; role: string }[];
}

// Function to create or fetch a chat
const createChat = async (userId1: string, userId2: string): Promise<Chat> => {
  const response = await fetch(`${API_URL}/chats/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId1, userId2 }),
  });

  if (!response.ok) {
    throw new Error('Failed to start chat');
  }

  return response.json();
};

// Custom hook for creating a chat
export const useCreateChat = () => {
  return useMutation({
    mutationFn: ({ userId1, userId2 }: { userId1: string; userId2: string }) =>
      createChat(userId1, userId2),
  });
};
