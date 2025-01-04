import { Listing } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo'; // Import Clerk auth

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

// Fetch Single Listing with Authorization Header
const fetchListing = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/listings/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Attach Bearer token
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch listing');
  }
  return response.json();
};

// React Query Hook
export const useFetchListing = (id: string) => {
  const { getToken } = useAuth(); // Get Clerk token

  return useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: async () => {
      const token = await getToken(); // Fetch token dynamically
      return fetchListing(id, token!);
    },
  });
};
