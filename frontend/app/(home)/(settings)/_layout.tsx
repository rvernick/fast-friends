import { Stack, router } from 'expo-router';
import { Button } from 'react-native-paper';

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="settings" options={{
          title: "Settings",
          headerShown: true,
        }} />
      <Stack.Screen name="change-password" options={{
        title: 'Change Password',
        headerLeft: () => <Button onPress={() => router.back()} icon="arrow-left">{""}</Button>,
      }} />
      <Stack.Screen name="getting-started" options={{
          title: "Getting Started",
          headerShown: true,
        }} />
      {/* <Stack.Screen name="load-user" options={{}} /> */}
    </Stack>
  );
}
