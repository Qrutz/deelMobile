import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

const fetchListings = async () => {
  const response = await fetch(`${API_URL}/listings`);
  if (!response.ok) {
    throw new Error('Failed to fetch listings');
  }
  return response.json();
};

export const useFetchListings = () => {
  return useQuery({ queryKey: ['listings'], queryFn: fetchListings });
};
