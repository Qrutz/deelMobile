/**
 * Fetch swap by id
 * e.g. /swap/123
 */

import { Swap } from '@/types';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

const fetchSwap = async (token: string, swapId: string) => {
  const url = `${API_URL}/swap/${swapId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch swap');
  }

  return response.json();
};

export const useFetchSwap = (swapId: string) => {
  const { getToken } = useAuth();

  return useQuery<Swap>({
    queryKey: ['swap', swapId],
    queryFn: async () => {
      const token = await getToken();
      return fetchSwap(token!, swapId);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
