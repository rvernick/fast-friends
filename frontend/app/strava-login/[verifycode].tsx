import { ensureString } from "@/common/utils";
import StravaLoginComponent from "@/components/strava/StravaLoginComponent";
import { useLocalSearchParams } from "expo-router";
import { Surface, Text } from "react-native-paper";

const StravaReply = () => {
  const reply = useLocalSearchParams();
  console.log(reply);
  // if (reply.error) {
  //   return (
  //     <Surface>
  //       <Text>Error: {reply.error}</Text>
  //     </Surface>
  //   );
  // }

  return (
    <Surface>
      <StravaLoginComponent
        verifycode={ensureString(reply.verifycode)}
        code={ensureString(reply.code)}
        scope={ensureString(reply.scope)}
        state={ensureString(reply.state)}
        error={ensureString(reply.error)} />
    </Surface>
  );
};

export default StravaReply;
