import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export const useUserData = () => {
    const { getToken, isSignedIn } = useAuth(); // Check if signed in

    return useQuery({
        queryKey: ['user'], // Query key for caching
        queryFn: async () => {
            const token = await getToken();
            const response = await fetch(`${API_URL}/user/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch user data');
            return response.json();
        },
        enabled: isSignedIn, // Only fetch if signed in
    });
};
