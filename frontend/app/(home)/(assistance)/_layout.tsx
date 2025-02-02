import { router, Stack } from "expo-router";
import { Button } from "react-native-paper";

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
        headerLeft: () => <Button onPress={goBack} icon="arrow-left">{""}</Button>,
      }} />
      <Stack.Screen name="instructions" options={{
          title: "Instructions",
          headerShown: true,
          headerLeft: () => <Button onPress={goToHelpRequests} icon="arrow-left">{""}</Button>,
        }} />
      <Stack.Screen name="helpRequest" options={{
        title: 'Help Request',
        headerLeft: () => <Button onPress={goBack} icon="arrow-left">{""}</Button>,
      }} />
    </Stack>
  );
}
