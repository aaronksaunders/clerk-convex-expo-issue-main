import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const InitialLayout = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (isSignedIn && !inTabsGroup) {
      router.replace("/(tabs)");
    } else if (!isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router, segments]);

  // Debug: log the Clerk token being sent to Convex
  useEffect(() => {
    if (isLoaded && isSignedIn && getToken) {
      getToken().then((token) => {
        console.log("[Clerk→Convex] JWT token:", token);
      });
    }
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <View style={{ flex: 1 }}>
      {isLoaded ? <Slot /> : <ActivityIndicator size="large" />}
    </View>
  );
};

export default function RootLayout() {
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
