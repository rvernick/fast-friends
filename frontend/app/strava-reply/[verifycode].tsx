import { ensureString } from "@/common/utils";
import StravaReplyComponent from "@/components/strava/StravaReplyComponent";
import { useLocalSearchParams } from "expo-router";
import { Surface, Text } from "react-native-paper";

const StravaReply = () => {
  const reply = useLocalSearchParams();

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
