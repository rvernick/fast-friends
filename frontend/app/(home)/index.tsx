import { useSession } from "@/ctx";
import { router } from "expo-router";
import { View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />;

export default function Index() {
  const goHome = () => { router.push("/") };
  const { signOut } = useSession();
  
  return (
    <View
      style={{
        flex: 1,
        margin: 16,
      }}
    >
      <Card>
        <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
        <Card.Title
          title="Card Title"
          subtitle="Card Subtitle"
          left={LeftContent}
        />
        <Card.Content>
          <Text variant="bodyMedium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            tenetur odit eveniet inventore magnam officia quia nemo porro?
            Dolore sapiente quos illo distinctio nisi incidunt? Eaque officiis
            iusto exercitationem natus?
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={goHome}>Open</Button>
        </Card.Actions>
      </Card>
      <Button mode="contained" onPress={signOut}>
        Log Out
      </Button>
    </View>
  );
}