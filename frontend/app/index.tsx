import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { Button, useTheme, Text } from "react-native-paper";

export default function Index() {
  const theme = useTheme();
  const goHome = () => { router.push("(home)") };
  const goSettings = () => { router.push("(home)/settings") };

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text>In app.  Edit app/index.tsx to edit this screen.</Text>
      <Button icon="bike-fast" mode="contained" onPress={goHome}>
        Bikes!
      </Button>
      <Button icon="bike" mode="contained" onPress={goSettings}>
        Bike
      </Button>
    </ThemedView>
  );
}
