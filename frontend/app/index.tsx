import { router, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import { Button, useTheme, Text, Surface } from "react-native-paper";

export default function Index() {
  const theme = useTheme();
  const signIn = () => { router.replace("/sign-in") };
  
  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text variant="headlineMedium">Fast Friends</Text>
      <Text>Welcome to Fast Friends, the on-line platform to assist you with bike maintenance</Text>
      <Text>You think about your rides and who you want to ride with next.</Text>
      <Text>We'll think about your bike needs so you don't have to</Text>
      <Text> </Text>
      <Text> </Text>
      <Button icon="bike-fast" mode="contained" onPress={signIn}>
        Get Started
      </Button>
    </Surface>
  );
}
