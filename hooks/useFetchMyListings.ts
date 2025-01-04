import { useQuery } from '@tanstack/react-query';
import { Listing } from '@/types';
import { useAuth } from '@clerk/clerk-expo';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

// Fetch listings for the current user
const fetchUserListings = async (token: string) => {
  const response = await fetch(`${API_URL}/user/me/listings`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user listings');
  }
  return response.json();
};

// React Query hook for fetching user listings
export const useFetchUserListings = () => {
  const { getToken } = useAuth(); // Clerk auth to get the token

  return useQuery<Listing[]>({
    queryKey: ['userListings'], // Cache key
    queryFn: async () => {
      const token = await getToken(); // Get JWT token
      return fetchUserListings(token!); // Fetch data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
