import { createStyles, styles } from "@/common/styles";
import { isMobile } from "@/common/utils";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { Button, useTheme, Text, Surface, Card } from "react-native-paper";

export default function Index() {
  const theme = useTheme();

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

  const signIn = () => { router.replace("/(sign-in-sign-up)/(sign-in)/sign-in") };

  return (
    <Surface style={useStyle.container}>
      <Card style={useStyle.containerScreen}>
        <Text style={{textAlign: "center"}} variant="headlineMedium">Pedal Assistant Support</Text>
          <Text style={{textAlign: "center"}}>Pedal assistant wants you to have the best experience possible</Text>
          <Text style={{textAlign: "center"}}>If you need any help, contact: support@pedal-assistant.com</Text>
          <Text> </Text>
          <Text> </Text>
          <Button icon="bike-fast" mode="contained" onPress={signIn}>
            Get Started
          </Button>
        </Card>
    </Surface>
  );
}
