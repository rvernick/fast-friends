import { router, Stack } from "expo-router";

export default function Layout() {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      console.log("Cannot go back from current screen");
      goToHelpRequests();
    }
  }

  const goToHelpRequests = () => {
    router.replace('/(home)/(assistance)/helpRequests');
  }
  
  return (
    <Stack>
      <Stack.Screen name="helpRequests" options={{
        title: 'Help Requests',
      }} />
      <Stack.Screen name="instructions" options={{
          title: "Instructions",
          headerShown: true,
        }} />
      <Stack.Screen name="helpRequest" options={{
        title: 'Help Request',
      }} />
    </Stack>
  );
}
