import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// TODO: try material UI for the tabs: https://callstack.github.io/react-native-paper/docs/guides/bottom-navigation

export default function SignInSignUp() {

  return (
    <Tabs>
      <Tabs.Screen
        name="(sign-in)"
        options={{
          title: "Sign In",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="login" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="privacy-policy"
        options={{
          title: "Privacy",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-plus" color={color} />
          ),
        }}
      />      
    </Tabs>
  );
}