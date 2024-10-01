import { router, Tabs, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from "@/ctx";
import { useEffect, useState } from "react";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function TabLayout() {
  const session = useSession();
  const route = useLocalSearchParams();
  // Cannot redirect until render is finished.  Use redirect to trigger useEffect when session is not authenticated
  const [redirected, setRedirected] = useState(false);

  if (!session.jwt_token && !redirected) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log("User not authenticated, redirecting to login");
    setRedirected(true);
  }

  console.log("User authenticated " + session + " " + session.email);

  useEffect(() => {
    if (!session.jwt_token) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log("User not authenticated, redirecting to login");
    router.replace('/(sign-in-sign-up)/(sign-in)/sign-in')
  }
  }, [redirected]);

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
          headerShown: true,
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