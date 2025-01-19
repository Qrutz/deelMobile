// useFetchProximityListings.ts
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';
import { Listing } from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

// The function to fetch listings near a given lat/lng
async function fetchProximityListings(
  token: string,
  lat: number,
  lng: number,
  radius: number
): Promise<Listing[]> {
  // Add them as query params: ?latitude=...&longitude=...&radius=...
  const url = `${API_URL}/listings/proximity?latitude=${lat}&longitude=${lng}&radius=${radius}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch proximity listings');
  }
  return response.json();
}

/**
 * React Query Hook:
 * @param lat user’s current latitude
 * @param lng user’s current longitude
 * @param radius optional distance in km, default 5 for example
 *
 * If lat/lng are null or we don’t want to fetch yet, we can disable the query.
 */
export function useFetchProximityListings(
  lat?: number,
  lng?: number,
  radius = 5 // default radius in km
) {
  const { getToken } = useAuth();

  return useQuery<Listing[]>({
    // The query key includes lat,lng,radius so React Query refetches if they change
    queryKey: ['listings', 'proximity', lat, lng, radius],
    queryFn: async () => {
      // If lat or lng is undefined, we skip (or you can handle that in your component)
      if (lat == null || lng == null) {
        return [];
      }
      const token = await getToken();
      return fetchProximityListings(token!, lat, lng, radius);
    },
    // Only enable if we actually have lat & lng
    enabled: lat != null && lng != null,
    // A re-fetch policy if needed
    staleTime: 60_000, // e.g. 1 minute
  });
}
