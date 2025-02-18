import { Stack, router } from "expo-router";
import { Button } from "react-native-paper";

export default function Layout() {

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      console.log("Cannot go back from current screen");
      router.replace('/(sign-in-sign-up)/(sign-in)/sign-in');
    }
  }

  return (
    <Stack >
      <Stack.Screen name="sign-in" options={{
          title: "Sign In",
          // headerTitleAlign: "center",
          headerShown: false,
        }} />
      <Stack.Screen name="password-reset" options={{
        title: 'Password Reset',
        headerLeft: () => <Button onPress={goBack} icon="arrow-left">{""}</Button>,
      }} />
      <Stack.Screen name="new-password-on-reset" options={{
        title: 'Password Reset',
        headerShown: false,
      }} />
    </Stack>
  );
}
