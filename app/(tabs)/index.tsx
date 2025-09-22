import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { Button, Text, View } from "react-native";

export default function Home() {
  const { isSignedIn, isLoaded, userId, sessionId, signOut } = useAuth();
  // const whoami = useQuery(
  //   api.whoami.whoami,
  //   isLoaded && isSignedIn ? undefined : "skip"
  // );

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
  // if (whoami instanceof Error) {
  //   whoamiError = whoami;
  //   console.error("Convex whoami error:", whoami);
  // }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: "#c00",
          fontSize: 18,
          textAlign: "center",
        }}
      >
        DEBUG: Home Tab Rendered
      </Text>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          marginTop: 60,
        }}
      >
        Clerk Test (Debug)
      </Text>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: "bold" }}>Clerk Session State:</Text>
        <Text>isLoaded: {String(isLoaded)}</Text>
        <Text>isSignedIn: {String(isSignedIn)}</Text>
        <Text>User ID: {userId ?? "-"}</Text>
        <Text>Session ID: {sessionId ?? "-"}</Text>
      </View>
      <Button
        title="Sign Out"
        onPress={async () => {
          await signOut();
          await clearClerkSession();
        }}
      />
      {whoamiError && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "#c00", fontWeight: "bold" }}>
            Convex whoami error:
          </Text>
          <Text selectable>{String(whoamiError)}</Text>
        </View>
      )}
      {/* {whoami && !(whoami instanceof Error) && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Convex Identity:</Text>
          <Text selectable>Subject: {whoami?.subject}</Text>
          <Text selectable>Provider: {whoami?.provider?.toLocaleString()}</Text>
          <Text selectable>Email: {whoami?.email}</Text>
        </View>
      )}  */}
    </View>
  );
}
