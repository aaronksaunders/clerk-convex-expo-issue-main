import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import React from "react";
import { Button, Text, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { isSignedIn, isLoaded, userId, sessionId, signOut } = useAuth();
  const whoami = useQuery(
    api.whoami.whoami,
    isLoaded && isSignedIn ? undefined : "skip"
  );

  // Helper to clear Clerk session token from SecureStore
  async function clearClerkSession() {
    try {
      const SecureStore = await import("expo-secure-store");
      await SecureStore.deleteItemAsync("__session");
    } catch (e) {
      console.log("Failed to clear session token:", e);
    }
  }

  let whoamiError = null;
  if (whoami instanceof Error) {
    whoamiError = whoami;
    console.error("Convex whoami error:", whoami);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fb",
        padding: 24,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 28,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#222",
            textAlign: "center",
          }}
        >
          Home
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#888",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Welcome to the Clerk + Convex Demo
        </Text>
        <View style={{ marginBottom: 20, width: "100%" }}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
            Clerk Session State
          </Text>
          <Text>isLoaded: {String(isLoaded)}</Text>
          <Text>isSignedIn: {String(isSignedIn)}</Text>
          <Text>User ID: {userId ?? "-"}</Text>
          <Text>Session ID: {sessionId ?? "-"}</Text>
        </View>
        <Button
          title="Sign Out"
          color="#ef4444"
          onPress={async () => {
            await signOut();
            await clearClerkSession();
          }}
        />
        {whoamiError && (
          <View style={{ marginTop: 24, width: "100%" }}>
            <Text style={{ color: "#c00", fontWeight: "bold" }}>
              Convex whoami error:
            </Text>
            <Text selectable>{String(whoamiError)}</Text>
          </View>
        )}
        {whoami && !(whoami instanceof Error) && (
          <View style={{ marginTop: 24, width: "100%" }}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
              Convex Identity
            </Text>
            <Text selectable>Subject: {whoami?.subject}</Text>
            <Text selectable>
              Provider: {whoami?.provider?.toLocaleString()}
            </Text>
            <Text selectable>Email: {whoami?.email}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
