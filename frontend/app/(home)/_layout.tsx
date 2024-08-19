import { Redirect, Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from "@/ctx";

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function TabLayout() {
  const session = useSession();

  console.log("session: " + session.jwt_token);
  if (!session.jwt_token) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log("User not authenticated, redirecting to login");
    return <Redirect href="/" />;
  }

  console.log("User authenticated " + session + " " + session.email);

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
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="logout" color={color} />
            ),
          }}
        />
    </Tabs>
  );
}