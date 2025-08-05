import { router, Stack } from "expo-router";

export default function Layout() {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      console.log("Cannot go back from current screen");
      router.push('/(home)/(maintenanceItems)/maintenance');
    }
  }

  return (
    <Stack initialRouteName="maintenance">
      <Stack.Screen name="maintenance" options={{
          title: "Maintenance",
          headerShown: true,
        }} />
      <Stack.Screen name="edit-item" options={{
        title: 'Maintenance Item',
      }} />
      <Stack.Screen name="bulk-maintenance" options={{
        title: "Initial Maintenance Schedule",
      }} />
      <Stack.Screen name="log-maintenance" options={{
        title: 'Log Maintenance',

      }} />
    </Stack>
  );
}
