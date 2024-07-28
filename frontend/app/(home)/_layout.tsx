import { Redirect, Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from "@/ctx";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function TabLayout() {
  const session = useSession();
  
  if (!session.jwt_token) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log("User not authenticated, redirecting to login");
    return <Redirect href="/sign-in" />;
  }

  console.log("User authenticated " + session + " " + session.email);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-settings" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bikes"
        options={{
          title: 'Bikes',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="bike-fast" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}