import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, TextInput, View } from "react-native";

/**
 * Sign-in screen component that handles user authentication
 * Provides email/password sign-in form with error handling and navigation
 * @returns JSX.Element - The sign-in screen UI
 */
export default function SignInScreen(): React.JSX.Element {
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const router = useRouter();

  /** Email address input state */
  const [emailAddress, setEmailAddress] = React.useState<string>("");
  /** Password input state */
  const [password, setPassword] = React.useState<string>("");
  /** Error message state for displaying authentication errors */
  const [error, setError] = React.useState<string | null>(null);

  /**
   * Handles the sign-in process when the sign-in button is pressed
   * Attempts to authenticate the user with provided credentials
   * Displays appropriate error messages for different failure scenarios
   */
  const onSignInPress = async (): Promise<void> => {
    setError(null);
    if (!isSignInLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      if (err.errors && err.errors[0].code === "form_identifier_not_found") {
        setError("No account found for this email. Please create an account.");
      } else if (
        err.errors &&
        err.errors[0].code === "form_password_incorrect"
      ) {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Sign in failed. Please try again.");
      }
    }
  };

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
          maxWidth: 360,
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 24,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 16,
            color: "#222",
            textAlign: "center",
          }}
        >
          Sign In
        </Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email address"
          onChangeText={setEmailAddress}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "#e0e0e0",
            borderRadius: 8,
            backgroundColor: "#fafbfc",
            fontSize: 16,
          }}
        />
        <TextInput
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#e0e0e0",
            borderRadius: 8,
            backgroundColor: "#fafbfc",
            fontSize: 16,
          }}
        />
        {error && (
          <Text
            style={{ color: "#c00", marginBottom: 12, textAlign: "center" }}
          >
            {error}
          </Text>
        )}
        <Button title="Sign In" color="#3b82f6" onPress={onSignInPress} />
        <View style={{ height: 12 }} />
        <Button
          title="Create Account"
          color="#10b981"
          onPress={() => {
            console.log("[SignIn] Create Account button pressed");
            router.push("/sign-up");
          }}
        />
      </View>
    </View>
  );
}
