import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

/**
 * Sign-up screen component that handles user registration
 * Provides email/password sign-up form with email verification
 * @returns JSX.Element - The sign-up screen UI
 */
export default function SignUpScreen(): React.JSX.Element {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();
  /** Email address input state */
  const [email, setEmail] = useState<string>("");
  /** Password input state */
  const [password, setPassword] = useState<string>("");
  /** Email verification code input state */
  const [code, setCode] = useState<string>("");
  /** Flag indicating if email verification is pending */
  const [pendingVerification, setPendingVerification] = useState<boolean>(false);
  /** Error message state for displaying registration errors */
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the initial sign-up process
   * Creates a new user account and initiates email verification
   * Displays appropriate error messages for different failure scenarios
   */
  const handleSignUp = async (): Promise<void> => {
    setError(null);
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      if (err.errors && err.errors[0].code === "form_identifier_exists") {
        setError("An account with this email already exists. Please sign in.");
      } else {
        setError("Sign up failed. Please try again.");
      }
    }
  };

  /**
   * Handles email verification code submission
   * Completes the sign-up process after successful verification
   * Redirects to the main app upon successful completion
   */
  const handleVerify = async (): Promise<void> => {
    setError(null);
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        setError("Verification not complete. Please check your code.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
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
          Sign Up
        </Text>
        {!pendingVerification ? (
          <>
            <TextInput
              autoCapitalize="none"
              value={email}
              placeholder="Email address"
              onChangeText={setEmail}
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
            <Button
              title="Create Account"
              color="#10b981"
              onPress={handleSignUp}
            />
            <View style={{ height: 12 }} />
            <Button
              title="Back to Sign In"
              color="#3b82f6"
              onPress={() => router.push("/sign-in")}
            />
          </>
        ) : (
          <>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 12,
                color: "#333",
                textAlign: "center",
              }}
            >
              Enter the verification code sent to your email
            </Text>
            <TextInput
              value={code}
              placeholder="Verification code"
              onChangeText={setCode}
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
            <Button
              title="Verify Email"
              color="#10b981"
              onPress={handleVerify}
            />
          </>
        )}
      </View>
    </View>
  );
}
