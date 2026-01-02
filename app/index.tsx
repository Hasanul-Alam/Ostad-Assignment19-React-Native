import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = false; // Replace with actual auth check

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/chat" />;
  }

  return <Redirect href="/(auth)/login" />;
}
