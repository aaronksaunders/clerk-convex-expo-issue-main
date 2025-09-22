import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const {
    signUp,
    isLoaded: isSignUpLoaded,
    setActive: setSignUpActive,
  } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState(
    "aaron+1@clearlyinnovative.com"
  );
  const [password, setPassword] = React.useState("!!123password");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [mode, setMode] = React.useState<"signIn" | "signUp">("signIn");
  const [error, setError] = React.useState<string | null>(null);

  const onSignInPress = async () => {
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

  const onSignUpPress = async () => {
    setError(null);
    if (!isSignUpLoaded) return;
    try {
      await signUp.create({
        emailAddress,
        password,
      });
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

  const onPressVerify = async () => {
    if (!isSignUpLoaded) return;
    console.log("Attempting to verify email...");
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        console.log("Email verification complete, setting active session...");
        await setSignUpActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(
          "Email verification not complete:",
          JSON.stringify(completeSignUp, null, 2)
        );
      }
    } catch (err) {
      console.error("Email verification error:", JSON.stringify(err, null, 2));
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
          Welcome
        </Text>
        {!pendingVerification && (
          <>
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
            {mode === "signIn" ? (
              <>
                <Button
                  title="Sign In"
                  color="#3b82f6"
                  onPress={onSignInPress}
                />
                <View style={{ height: 12 }} />
                <Button
                  title="Create Account"
                  color="#10b981"
                  onPress={() => {
                    setMode("signUp");
                    setError(null);
                  }}
                />
              </>
            ) : (
              <>
                <Button
                  title="Create Account"
                  color="#10b981"
                  onPress={onSignUpPress}
                />
                <View style={{ height: 12 }} />
                <Button
                  title="Back to Sign In"
                  color="#3b82f6"
                  onPress={() => {
                    setMode("signIn");
                    setError(null);
                  }}
                />
              </>
            )}
          </>
        )}
        {pendingVerification && (
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
            <Button
              title="Verify Email"
              color="#10b981"
              onPress={onPressVerify}
            />
          </>
        )}
      </View>
    </View>
  );
}
