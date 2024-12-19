import { useMutation, useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';

interface Listing {
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  userId: string;
  imageUrl: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newListing: Listing) => {
      const response = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
