import { Stack } from "expo-router";

export default function Layout() {

  return (
    <Stack >
      <Stack.Screen name="index" options={{
          title: "Bikes",
          headerShown: true,
        }} />
      <Stack.Screen name="[bikeid]" options={{
        title: 'Bike',
        headerShown: true,
        
      }} />
    </Stack>    
  );
}
