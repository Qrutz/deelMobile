import { Listing } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo'; // Import Clerk auth hook
import { Category } from '@/constants/Categories';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

interface CreateListingType {
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  category: Category;
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth(); // Clerk getToken hook

  return useMutation({
    mutationFn: async (newListing: CreateListingType) => {
      // Retrieve the Clerk token
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const response = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add the Bearer token
        },
        body: JSON.stringify(newListing),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate any queries that depend on listings
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: (error) => {
      console.error('Error creating listing:', error);
    },
  });
}
