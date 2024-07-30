import { Redirect, Stack, Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from "@/ctx";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="bikes" options={{
          title: "Bikes",
          headerShown: false,
        }} />
      <Stack.Screen name="bike" options={{
        title: 'Bike',
        headerShown: false,
      }} />
    </Stack>
  );
}
