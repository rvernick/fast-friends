import { createStyles, styles } from "@/common/styles";
import { isMobile } from "@/common/utils";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import { Image } from "react-native";
import { Button, useTheme, Text, Surface, Card, IconButton } from "react-native-paper";

export default function Index() {
  const theme = useTheme();

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

  const signIn = () => { router.replace("/(sign-in-sign-up)/(sign-in)/sign-in") };
  const appStoreURL = "https://apps.apple.com/us/app/pedal-assistant/id6680175112?itscg=30200&itsct=apps_box_badge&mttnsubad=6680175112";

  return (
    <Surface style={useStyle.container}>
      <Image
        source={{
          uri: 'https://apps.apple.com/us/app/pedal-assistant/id6680175112?itscg=30200&itsct=apps_box_badge&mttnsubad=6680175112',
        }}
        />
      <Card mode="contained" style={useStyle.containerCentered} >
        <Text style={{textAlign: "center"}} variant="headlineMedium">Pedal Assistant</Text>
        <Text style={{textAlign: "center"}}>Welcome to Pedal Assistant, the on-line platform to assist you with bike maintenance</Text>
        <Text style={{textAlign: "center"}}>You think about your rides and who you want to ride with next.</Text>
        <Text style={{textAlign: "center"}}>We'll think about your bike needs so you don't have to</Text>
        <Text> </Text>
        <Text> </Text>
        <Button icon="bike-fast" mode="contained" onPress={signIn}>
          Get Started
        </Button>
      </Card>

      <Card mode="contained">
        <IconButton
          disabled={true}
          onPress={() => console.log("Powered by Strava")}
          style={{ left: 1, width: 196, height: 82 }}
          icon={() => <Image
                  source={require("../assets/images/api_logo_pwrdBy_strava_stack_light.svg")}
                  />}
          mode="contained"
        />
      </Card>
      { isMobile() ? null : (
        <Card mode="contained">
          <IconButton
            onPress={() => window.open(appStoreURL)}
            style={{ left: 1, width: 246, height: 82 }}
            icon={() =>
              <Image
                source={{
                  uri: 'https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1728691200',
                }}
                style={{ width: 246, height: 82}}
                />}
                mode="contained"
          />
        </Card>
      )}
    </Surface>
  );
}
