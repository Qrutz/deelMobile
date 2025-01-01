import { Listing } from '@/types';
import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

const fetchListing = async (id: string) => {
  const response = await fetch(`${API_URL}/listings/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch listing');
  }
  return response.json();
};

export const useFetchListing = (id: string) => {
  return useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: () => fetchListing(id),
  });
};
