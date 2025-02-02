import { router, Stack } from "expo-router";
import { Button } from "react-native-paper";

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
    <Stack>
      <Stack.Screen name="maintenance" options={{
          title: "Maintenance",
          headerShown: true,
        }} />
      <Stack.Screen name="[maintenanceid]" options={{
        title: 'Maintenance Item',
        headerLeft: () => <Button onPress={goBack} icon="arrow-left">{""}</Button>,
      }} />
      <Stack.Screen name="log-maintenance" options={{
        title: 'Log Maintenance',
        headerLeft: () => <Button onPress={goBack} icon="arrow-left">{""}</Button>,
      }} />
    </Stack>
  );
}
