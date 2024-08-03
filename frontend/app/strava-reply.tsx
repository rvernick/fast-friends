import { ensureString } from "@/common/utils";
import StravaReplyComponent from "@/components/strava/StravaReplyComponent";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native-paper";

const StravaReply = () => {
  const reply = useLocalSearchParams();
  if (reply.error) {
    return (
      <ThemedView>
        <Text>Error: {reply.error}</Text>
      </ThemedView>

    );
  }

  // return (
  //   <ThemedView>
  //     <Text>Strava Connection successful. Please return to Settings.</Text>
  //     <Text>Code: {ensureString(reply.code)}</Text>
  //     <Text>Scope:  {ensureString(reply.scope)}</Text>
  //     <Text>State:  {ensureString(reply.state)}</Text>
  //   </ThemedView>
  // );

  return (
    <ThemedView>
      <StravaReplyComponent 
        code={ensureString(reply.code)} 
        scope={ensureString(reply.scope)} 
        state={ensureString(reply.state)} />
    </ThemedView>
  );
};

export default StravaReply;
