import { router, Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from "react-native-paper"
import { useSession } from "@/ctx";
import { useState } from "react";
import { tabBarIconSize } from "@/common/styles";


// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function ProfileTabLayout() {

  return (
    <Tabs initialRouteName="(profile)">
      <Tabs.Screen
        name="(bikes)"
        options={{
          title: "Bikes",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={tabBarIconSize} name="bike-fast" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: "Settings",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={tabBarIconSize} name="account-settings" color={color} />
          ),
        }}
      />
      <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons size={tabBarIconSize} name="home" color={color} />
            ),
          }}
      />
    </Tabs>
  );
}