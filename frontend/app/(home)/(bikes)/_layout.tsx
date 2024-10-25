import { Stack, Tabs, router } from "expo-router";
import { Button } from "react-native-paper";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="index" options={{
          title: "Bikes",
          headerShown: false,
        }} />
      <Stack.Screen name="[bikeid]" options={{
        title: 'Bike',
        headerLeft: () => <Button onPress={() => router.back()} icon="arrow-left">{""}</Button>,
      }} />
    </Stack>    
  );
}
