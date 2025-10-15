import { router, Tabs } from "expo-router";
import { useSession } from "@/common/ctx";
import React, { useEffect, useState } from "react";
import { tabBarIconSize } from "@/common/styles";
import { isMobileSize } from "@/common/utils";
import { Text } from "@/components/ui/text";
import {
  WrenchIcon,
  SettingsIcon,
  BikeIcon,
  BriefcaseMedicalIcon,
  LogOutIcon,
} from "lucide-react-native"


// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation
// TODO: there's also a library to use native tab bars

export default function TabLayout() {
  const { jwt_token, email, isLoading } = useSession();
  // Cannot redirect until render is finished.  Use redirect to trigger useEffect when session is not authenticated
  const [redirected, setRedirected] = useState(false);

  const goToSignInIfNotAuthenticated = () => {
    if (!jwt_token && !redirected) {
      // On web, static rendering will stop here as the user is not authenticated
      // in the headless Node process that the pages are rendered in.
      console.log("User not authenticated, redirecting to login");
      setRedirected(true);
      router.replace("/(sign-in-sign-up)/(sign-in)/sign-in");
    }
  }

  useEffect(() => {
    goToSignInIfNotAuthenticated();
  }, [jwt_token]);

  if (isLoading || redirected) {
    return <Text>Loading...</Text>;
  }

  return (
    <Tabs initialRouteName="(maintenanceItems)">
      <Tabs.Screen
        name="(maintenanceItems)"
        options={{
          title: "Maintenance",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <WrenchIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(maintenanceHistory)"
        options={{
          href: null,
          title: "History",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <BikeIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(bikes)"
        options={{
          title: "Bikes",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <BikeIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(assistance)"
        options={{
          title: "Assistance",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <BriefcaseMedicalIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <SettingsIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      {/* // If on mobile, hide the sign out tab for space savings */}
      {isMobileSize() ?
        <Tabs.Screen
            name="sign-out"
            options={{
              href: null,
              title: "Sign Out",
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <LogOutIcon size={tabBarIconSize} color={color} />
              ),
            }}
          />
          :
          <Tabs.Screen
          name="sign-out"
          options={{
            title: "Sign Out",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <LogOutIcon size={tabBarIconSize} color={color} />
            ),
          }}
        />
      }

    </Tabs>
  );
}
