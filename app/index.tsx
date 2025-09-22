import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function Index() {
  const { isLoaded, userId, sessionId } = useAuth();
  const { isLoaded: isSignInLoaded } = useSignIn();

  React.useEffect(() => {
    console.log("Auth State:", { isLoaded, userId, sessionId });
  }, [isLoaded, userId, sessionId]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>{isLoaded ? "Loaded" : "Not loaded"}</Text>
      <Text>{userId ? `User ID: ${userId}` : "No user ID"}</Text>
      <Text>{sessionId ? `Session ID: ${sessionId}` : "No session ID"}</Text>
      <Login />
    </View>
  );
}

const Login = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Login Screen</Text>
      <Text>{isLoaded ? "Loaded" : "Not loaded"}</Text>
      <TextInput
        placeholder="Email"
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          width: 200,
          paddingHorizontal: 10,
        }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          width: 200,
          paddingHorizontal: 10,
        }}
      />
      <Button
        title="Login"
        onPress={async () => {
          // Handle login logic here
          console.log("Login pressed");
          if (!isLoaded) return;

          try {
            const signInResult = await signIn.create({
              identifier: "aaron+1@clearlyinnovative.com",
              password: "!!123password",
            });
            if (signInResult.status === "complete") {
              await setActive({
                session: signInResult.createdSessionId,
              });

              console.log(
                "Login successful",
                JSON.stringify(signInResult, null, 2)
              );
              router.replace("/");
            } else {
              console.error(JSON.stringify(signInResult, null, 2));
            }
          } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
          }
        }}
      />
      <Button onPress={async () => await signOut()} title="SignOut" />
    </View>
  );
};
