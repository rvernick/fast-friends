import { Tabs } from "expo-router";
import { tabBarIconSize } from "@/common/styles";
import {
  LogInIcon,
  UserPlusIcon,
  MailCheckIcon,
  BriefcaseMedicalIcon,
  FileKeyIcon,
  MapIcon,
} from "lucide-react-native"

export default function SignInSignUp() {

  return (
    <Tabs>
      <Tabs.Screen
        name="(sign-in)"
        options={{
          title: "Sign In",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <LogInIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <UserPlusIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <BriefcaseMedicalIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          href: null,   // Uncomment for map testing
          title: "Map",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MapIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="privacy-policy"
        options={{
          title: "Privacy",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <FileKeyIcon size={tabBarIconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wait-for-verification"
        options={{
          href: null,
          title: "Waiting",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MailCheckIcon size={tabBarIconSize} color={color}/>
          ),
        }}
      />
    </Tabs>
  );
}