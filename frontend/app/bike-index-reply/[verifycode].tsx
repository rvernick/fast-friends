import { ensureString } from "@/common/utils";
import BikeIndexReplyComponent from "@/components/bikeIndex/BikeIndexReplyComponent";
import { useLocalSearchParams } from "expo-router";
import { Surface, Text } from "react-native-paper";

const BikeIndexReply = () => {
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
      <BikeIndexReplyComponent
        verifycode={ensureString(reply.verifycode)}
        code={ensureString(reply.code)}
        scope={ensureString(reply.scope)}
        state={ensureString(reply.state)} />
    </Surface>
  );
};

export default BikeIndexReply;
