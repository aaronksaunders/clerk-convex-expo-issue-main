import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

/**
 * Token cache implementation for Clerk authentication using Expo SecureStore
 * Provides secure storage for authentication tokens
 */
const tokenCache = {
  /**
   * Retrieves a stored token from SecureStore
   * @param key - The key to retrieve the token for
   * @returns Promise<string | null> - The stored token or null if not found
   */
  async getToken(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },
  /**
   * Saves a token to SecureStore
   * @param key - The key to store the token under
   * @param value - The token value to store
   * @returns Promise<void>
   */
  async saveToken(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  },
};

/**
 * Convex React client instance configured with the Convex deployment URL
 * Disables unsaved changes warning for better development experience
 */
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

/**
 * Initial layout component that handles authentication-based navigation
 * Manages the initial routing logic based on user authentication state
 * Prevents flash of incorrect content during app startup
 */
const InitialLayout = (): React.JSX.Element => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState<boolean>(false);

  /**
   * Effect hook that handles navigation based on authentication state
   * Redirects users to appropriate screens based on their sign-in status
   * Includes a small delay to prevent visual flash during startup
   */
  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(tabs)";
    const inAuthGroup = segments[0] === "sign-in" || segments[0] === "sign-up";

    // Add a small delay to prevent flash
    const timer = setTimeout(() => {
      setIsNavigating(true);
      if (isSignedIn && !inTabsGroup) {
        router.replace("/(tabs)");
      } else if (!isSignedIn && !inAuthGroup) {
        router.replace("/sign-in");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, router, segments]);

  /**
   * Debug effect that logs the Clerk JWT token being sent to Convex
   * Helps with debugging authentication issues
   */
  useEffect(() => {
    if (isLoaded && isSignedIn && getToken) {
      getToken().then((token) => {
        console.log("[Clerk→Convex] JWT token:", token);
      });
    }
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fb" }}>
      {!isLoaded || !isNavigating ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f9fb",
          }}
        >
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <Slot />
      )}
    </View>
  );
};

/**
 * Root layout component that provides authentication and data layer context
 * Wraps the entire app with Clerk authentication and Convex data providers
 * @returns JSX.Element - The root layout with all necessary providers
 */
export default function RootLayout(): React.JSX.Element {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <InitialLayout />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
