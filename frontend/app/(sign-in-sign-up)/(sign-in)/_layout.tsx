import { Stack, router } from "expo-router";
import { Button } from "react-native-paper";

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="sign-in" options={{
          title: "Sign In",
          headerShown: true,
        }} />
      <Stack.Screen name="password-reset" options={{
        title: 'Password Reset',
        headerLeft: () => <Button onPress={() => router.back()} icon="arrow-left">{""}</Button>,
      }} />
    </Stack>
  );
}
