import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';

// Adjust these imports/types as necessary
import { Swap } from '@/types'; // define or import your Swap type
const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

/**
 * Fetch user swaps from /swap/me. Optionally filter by status:
 * e.g. /swap/me?status=accepted
 */
const fetchUserSwaps = async (token: string, status?: string) => {
  const url = status
    ? `${API_URL}/swap/me?status=${status}`
    : `${API_URL}/swap/me`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user swaps');
  }

  return response.json();
};

/**
 * React Query hook for fetching the current user’s swaps.
 * Optional `status` param to fetch only certain swaps (e.g., "accepted").
 */
export const useFetchMySwaps = (status?: string) => {
  const { getToken } = useAuth();

  return useQuery<Swap[]>({
    queryKey: ['mySwaps', status],
    queryFn: async () => {
      const token = await getToken();
      // The exclamation mark is used to assert token won't be null
      // but handle it in your real code if there's a chance it's missing
      return fetchUserSwaps(token!, status);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
