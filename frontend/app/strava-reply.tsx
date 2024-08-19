import { ensureString } from "@/common/utils";
import StravaReplyComponent from "@/components/strava/StravaReplyComponent";
import { useLocalSearchParams } from "expo-router";
import { Surface, Text } from "react-native-paper";

const StravaReply = () => {
  const reply = useLocalSearchParams();
  if (reply.error) {
    return (
      <Surface>
        <Text>Error: {reply.error}</Text>
      </Surface>

    );
  }

  // return (
  //   <Surface>
  //     <Text>Strava Connection successful. Please return to Settings.</Text>
  //     <Text>Code: {ensureString(reply.code)}</Text>
  //     <Text>Scope:  {ensureString(reply.scope)}</Text>
  //     <Text>State:  {ensureString(reply.state)}</Text>
  //   </Surface>
  // );

  return (
    <Surface>
      <StravaReplyComponent 
        code={ensureString(reply.code)} 
        scope={ensureString(reply.scope)} 
        state={ensureString(reply.state)} />
    </Surface>
  );
};

export default StravaReply;
