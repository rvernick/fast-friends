import { useSession } from "@/common/ctx";
import { ensureString, sleep } from "@/common/utils";
import StravaLoginComponent from "@/components/strava/StravaLoginComponent";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Surface, Text } from "react-native-paper";

const StravaReply = () => {
  const reply = useLocalSearchParams();
  
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
