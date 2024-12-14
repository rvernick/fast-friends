import { createStyles, defaultWebStyles } from "@/common/styles";
import { isMobile } from "@/common/utils";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { Button, useTheme, Text, Surface, Card } from "react-native-paper";

export default function Index() {
  const theme = useTheme();

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

  const signIn = () => { router.replace("/(sign-in-sign-up)/(sign-in)/sign-in") };

  return (
    <Surface style={useStyle.container}>
      <Card style={useStyle.containerScreen}>
        <Text style={{textAlign: "center"}} variant="headlineMedium">Pedal Assistant Privacy</Text>
          <Text style={{textAlign: "center"}}>Pedal Assistant does its best to maintain your data securly and privately</Text>
          <Text style={{textAlign: "center"}}>Currently, we do not track your use of the app or share any data.</Text>
          <Text style={{textAlign: "center"}}>Our privacy policy is evolving.  We'll notify you when it changes.</Text>
          <Text style={{textAlign: "center"}}>If you have questions, contact: privacy@pedal-assistant.com</Text>
          <Text> </Text>
          <Text> </Text>
          <Button icon="bike-fast" mode="contained" onPress={signIn}>
            Get Started
          </Button>
        </Card>
    </Surface>
  );
}
