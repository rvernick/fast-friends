import { router, Stack } from "expo-router";
import { Button } from "react-native-paper";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="maintenance" options={{
          title: "Maintenance Items",
          headerShown: false,
        }} />
      <Stack.Screen name="[maintenanceid]" options={{
        title: 'Maintenance Item',
        headerLeft: () => <Button onPress={() => router.back()} icon="arrow-left">{""}</Button>,
      }} />
      <Stack.Screen name="log-maintenance" options={{
        title: 'Log Maintenance',
        headerLeft: () => <Button onPress={() => router.back()} icon="arrow-left">{""}</Button>,
      }} />
    </Stack>
  );
}
