import { Stack, Tabs, router } from "expo-router";
import { Button } from "react-native-paper";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function Layout() {
  
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      console.log("Cannot go back from current screen");
      router.push('/(home)/(bikes)');
    }
  }
  return (
    <Stack >
      <Stack.Screen name="index" options={{
          title: "Bikes",
          headerShown: false,
        }} />
      <Stack.Screen name="[bikeid]" options={{
        title: 'Bike',
        headerLeft: () => <Button onPress={goBack} icon="arrow-left">{""}</Button>,
      }} />
    </Stack>    
  );
}
