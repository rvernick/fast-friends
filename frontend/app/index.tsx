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
        <Text style={{textAlign: "center"}} variant="headlineMedium">Pedal Assistant</Text>
        {/* <Card style={useStyle.centerScreen}> */}
          <Text style={{textAlign: "center"}}>Welcome to Pedal Assistant, the on-line platform to assist you with bike maintenance</Text>
          <Text style={{textAlign: "center"}}>You think about your rides and who you want to ride with next.</Text>
          <Text style={{textAlign: "center"}}>We'll think about your bike needs so you don't have to</Text>
          <Text> </Text>
          <Text> </Text>
          <Button icon="bike-fast" mode="contained" onPress={signIn}>
            Get Started
          </Button>
        </Card>
      {/* </Card> */}
    </Surface>
  );
}
