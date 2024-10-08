import { Stack, router } from 'expo-router';
import { Button } from 'react-native-paper';

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="settings" options={{
          title: "Settings",
          headerShown: false,
        }} />
      <Stack.Screen name="change-password" options={{
        title: 'Change Password',
        headerLeft: () => <Button onPress={() => router.back()} icon="arrow-left">{""}</Button>,
      }} />
      {/* <Stack.Screen name="load-user" options={{}} /> */}
    </Stack>
  );
}
