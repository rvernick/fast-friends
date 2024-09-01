import { Redirect, Stack, Tabs, router } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from "@/ctx";
import { Button } from "react-native-paper";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

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
