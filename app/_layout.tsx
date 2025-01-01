import { tokenCache } from '@/cache';
import { ClerkProvider, ClerkLoaded, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Slot, usePathname } from 'expo-router';
import BottomNavigation from '@/components/BottomNavigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import "../assets/global.css";
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Safe area support

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

  const queryClient = new QueryClient();

  // Get the current pathname
  const pathname = usePathname();

  // Define routes where the bottom navigation bar should be hidden
  const hideBottomNav = pathname.startsWith('/chat/') || pathname.startsWith('/product/');

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          {/* SafeAreaView only respects the top edge */}
          <SafeAreaView style={styles.safeContainer} edges={['top']}>
            {/* Customize Status Bar */}
            <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

            <View style={styles.container}>
              {/* Main content slot */}
              <View style={styles.pageContainer}>
                <Slot />
              </View>

              {/* Show bottom navigation only if signed in and not on excluded pages */}
              <SignedIn>
                {!hideBottomNav && <BottomNavigation />}
              </SignedIn>
            </View>
          </SafeAreaView>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Light background for better contrast with the status bar
  },
  container: {
    flex: 1,
  },
  pageContainer: {
    flex: 1, // Allow content to occupy remaining space above the bottom navigation
  },
});
