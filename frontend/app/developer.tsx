import { baseUrl } from "@/common/http-utils";
import { ensureString } from "@/common/utils";
import { router } from "expo-router";
import { Button, useTheme, Text, Surface, List } from "react-native-paper";

export default function Index() {
  const theme = useTheme();
  const signIn = () => { router.replace("/(sign-in-sign-up)/(sign-in)/sign-in") };  
  
  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text variant="headlineMedium">Pedal Assistant</Text>
      <Text>baseURL: {baseUrl()}</Text>
      <List.Section>
        {
          Object.entries(process.env).map(([key, value]) => (
            <List.Item key={key} title={key} description={String(value)} />
          ))
        }
      </List.Section>
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
