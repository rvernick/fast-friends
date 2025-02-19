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
  // TODO: moved all history under home for easier navigation  Need to update links
  return (
    <Stack>
      <Stack.Screen name="history" options={{
          title: "History",
          headerShown: true,       
        }} />
      <Stack.Screen name="[maintenancehistoryid]" options={{
        title: 'Maintenance History',
      }} />
    </Stack>
  );
}
