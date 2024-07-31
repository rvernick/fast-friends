import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="settings" options={{
          title: "Settings",
          headerShown: false,
        }} />
      <Stack.Screen name="change-password" options={{
        title: 'Change Password',
        headerShown: false,
      }} />
      {/* <Stack.Screen name="load-user" options={{}} /> */}
    </Stack>
  );
}
