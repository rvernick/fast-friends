import { router, Tabs, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from "react-native-paper"
import { useSession } from "@/ctx";
import { useEffect, useState } from "react";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function TabLayout() {
  const { jwt_token, email, isLoading } = useSession();

  // Cannot redirect until render is finished.  Use redirect to trigger useEffect when session is not authenticated
  const [redirected, setRedirected] = useState(false);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!jwt_token && !redirected) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log("User not authenticated, redirecting to login");
    setRedirected(true);
    router.replace('/(sign-in-sign-up)/(sign-in)/sign-in')
  }

  console.log("User authenticated " + jwt_token + " " + email);

  return (
    <Tabs>
      <Tabs.Screen
        name="(bikes)"
        options={{
          title: "Bikes",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bike-fast" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(maintenanceItems)"
        options={{
          title: "Maintenance",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="wrench" color={color} />
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
          name="sign-out"
          options={{
            title: "Sign Out",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="logout" color={color} />
            ),
          }}
        />
    </Tabs>
  );
}