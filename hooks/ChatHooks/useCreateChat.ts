// createChat.ts

import { useMutation } from '@tanstack/react-query';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export interface StartChatResponse {
  chatId: string;
  isNew: boolean;
}

// The function that hits /chats/start
const createChat = async (
  userId1: string,
  userId2: string
): Promise<StartChatResponse> => {
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

  // parse { chatId, isNew }
  return response.json();
};

// Then the hook
export const useCreateChat = () => {
  return useMutation({
    mutationFn: ({ userId1, userId2 }: { userId1: string; userId2: string }) =>
      createChat(userId1, userId2),
  });
};
