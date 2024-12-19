import { tokenCache } from '@/cache';
import { ClerkProvider, ClerkLoaded, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import BottomNavigation from '@/components/BottomNavigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import "../assets/global.css";
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <View style={styles.container}>
            {/* Main content slot */}
            <View style={styles.pageContainer}>
              <Slot />
            </View>

            {/* Show bottom navigation only if signed in */}
            <SignedIn>
              <BottomNavigation />
            </SignedIn>
          </View>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    flex: 1, // Allow content to occupy remaining space above the bottom navigation
  },
});
