import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Button, TextInput, View, Text } from "react-native";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded, setActive: setSignUpActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("aaron+1@clearlyinnovative.com");
  const [password, setPassword] = React.useState("!!123password");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignInPress = async () => {
    if (!isSignInLoaded) return;
    console.log("Attempting to sign in...");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        console.log("Sign in complete, setting active session...");
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error("Sign in not complete:", JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      if (err.errors[0].code === "form_identifier_not_found") {
        console.log("User not found, attempting to sign up...");
        onSignUpPress();
      } else {
        console.error("Sign in error:", JSON.stringify(err, null, 2));
      }
    }
  };

  const onSignUpPress = async () => {
    if (!isSignUpLoaded) return;
    console.log("Attempting to sign up...");

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      console.log("Sign up created, preparing email verification...");
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error("Sign up error:", JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isSignUpLoaded) return;
    console.log("Attempting to verify email...");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === "complete") {
        console.log("Email verification complete, setting active session...");
        await setSignUpActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error("Email verification not complete:", JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      console.error("Email verification error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            style={{ width: "80%", padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
          />
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            style={{ width: "80%", padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
          />
          <Button title="Sign In" onPress={onSignInPress} />
        </>
      )}
      {pendingVerification && (
        <>
          <Text>Enter the code sent to your email</Text>
          <TextInput
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
            style={{ width: "80%", padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
          />
          <Button title="Verify" onPress={onPressVerify} />
        </>
      )}
    </View>
  );
}
