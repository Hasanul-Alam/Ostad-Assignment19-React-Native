/* eslint-disable import/no-named-as-default */
/* eslint-disable react-hooks/exhaustive-deps */
// app/_layout.tsx
import { AuthProvider } from "@/src/contexts/AuthContext";
import useAuth from "@/src/hooks/useAuth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

// This component handles automatic navigation based on auth state
function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything while checking auth state
    if (loading) return;

    // Check if we're in the auth group (login/signup screens)
    const inAuthGroup = segments[0] === "(auth)";

    console.log("Auth State:", {
      user: user?.email,
      loading,
      inAuthGroup,
      segments,
    });

    // If user is NOT logged in and NOT in auth screens -> go to login
    if (!user && !inAuthGroup) {
      console.log("Redirecting to login (no user)");
      router.replace("/(auth)/login");
    }
    // If user IS logged in and IS in auth screens -> go to main app
    else if (user && inAuthGroup) {
      console.log("Redirecting to main app (user logged in)");
      router.replace("/(tabs)/chat");
    }
  }, [user, loading, segments]);

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f0c29",
        }}
      >
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// Main layout wrapper with AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
