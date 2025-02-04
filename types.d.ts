import { TransactionType } from './app/(home)/modaltest';

// Define the User type
export interface User {
  id: string;
  name: string;
  fullName: string;
  image: string;
  email: string;
  username?: string | null; // Optional since it's null in your example
  profileImageUrl?: string | null; // Optional since it's null in your example

  listings: Listing[];
}

// Define the Listing type
export interface Listing {
  id: number;
  title: string;
  description: string;
  price?: number;
  category: string;
  latitude: number;
  longitude: number;
  ImageUrl: string;
  createdAt: string; // Date as a string in ISO format
  userId: string; // Clerk user ID
  user: User; // Nested user object
  isOwner?: boolean;
  swapPreferences?: string;
  locationName?: string;
  condition?: string;
}

interface Swap {
  id: string;
  listingA: Listing;
  listingB: Listing;
  proposerId: string;
  recipientId: string;
  status: string; // "accepted", "inProgress", "completed", etc.
  partialCash?: number;
  pickupTime: string; // Date as a string in ISO format
  note?: string;
  chatId?: string;
}
