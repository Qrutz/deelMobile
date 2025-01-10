import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo'; // Import Clerk auth
import { Listing } from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

// Fetch Listings with Authorization Header
const fetchListings = async (token: string): Promise<Listing[]> => {
  const response = await fetch(`${API_URL}/listings`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Attach Bearer token
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch listings');
  }

  return response.json();
};

// React Query Hook
export const useFetchListings = () => {
  const { getToken } = useAuth(); // Get Clerk token

  return useQuery<Listing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      const token = await getToken(); // Fetch the token dynamically
      return fetchListings(token!);
    },
  });
};
