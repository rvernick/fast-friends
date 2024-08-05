import { Redirect, Stack, Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from "@/ctx";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="maintenanceItems" options={{
          title: "Maintenance Items",
          headerShown: false,
        }} />
      {/* <Stack.Screen name="[maintenanceItem]" options={{
        title: 'Maintenance Item',
        headerShown: true,
      }} /> */}
    </Stack>
  );
}
