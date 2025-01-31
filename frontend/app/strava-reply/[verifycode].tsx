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

  return (
    <Surface>
      <StravaReplyComponent
        verifycode={ensureString(reply.verifycode)} 
        code={ensureString(reply.code)} 
        scope={ensureString(reply.scope)} 
        state={ensureString(reply.state)} />
    </Surface>
  );
};

export default StravaReply;


// http://localhost:8081/strava-user/12345?code=blah?scope=scp?state=CA