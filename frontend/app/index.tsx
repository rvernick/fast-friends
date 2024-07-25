import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, useTheme, Text } from "react-native-paper";

export default function Index() {
  const theme = useTheme();
  
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>In app.  Edit app/index.tsx to edit this screen.</Text>
      <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
        Press me
      </Button>
    </ThemedView>
  );
}
