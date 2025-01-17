import { useAuth } from '@clerk/clerk-expo';
import { useQueryClient, useMutation } from '@tanstack/react-query';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

// e.g. useAcceptDeal.ts
export function useAcceptDeal() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (swapId: string) => {
      const token = await getToken();
      const resp = await fetch(`${API_URL}/swap/${swapId}/complete`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!resp.ok) throw new Error('Failed to accept deal');
      return resp.json();
    },
    onSuccess: (updatedSwap) => {
      queryClient.invalidateQueries({
        queryKey: ['swap', updatedSwap.id],
      });
    },
  });
}
