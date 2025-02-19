import { Stack, router } from 'expo-router';
import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icon";

export default function Layout() {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      console.log("Cannot go back from current screen");
      router.replace('/(home)/(settings)/settings');
    }
  }
  return (
    <Stack >
      <Stack.Screen name="settings" options={{
          title: "Settings",
          headerShown: true,
        }} />
      <Stack.Screen name="change-password" options={{
        title: 'Change Password',
      }} />
      <Stack.Screen name="getting-started" options={{
          title: "Getting Started",
          headerShown: true,
        }} />
      {/* <Stack.Screen name="load-user" options={{}} /> */}
    </Stack>
  );
}
