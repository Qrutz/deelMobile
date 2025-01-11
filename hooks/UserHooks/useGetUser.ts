// src/hooks/UserHooks/useFetchUser.ts

import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

// Adjust this API_URL or import from your config
const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

// Example user interface (customize it to match your real API)

// A function that calls your API endpoint
async function fetchUserById(userId: string): Promise<User> {
  const response = await fetch(`${API_URL}/user/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with id: ${userId}`);
  }
  return response.json();
}

// Our custom hook
export function useFetchUser(userId: string) {
  return useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    enabled: Boolean(userId), // only run if we have a valid userId
  });
}
