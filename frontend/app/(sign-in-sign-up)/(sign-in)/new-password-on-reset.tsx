import { ensureString } from "@/common/utils";
import { NewPasswordOnResetComponent } from "@/components/account/NewPasswordOnResetComponent";
import { useLocalSearchParams } from "expo-router";
import { Surface } from "react-native-paper";

const NewPasswordOnReset = () => {
  const resetInfo = useLocalSearchParams();

  return (
    <Surface>
      <NewPasswordOnResetComponent token={ensureString(resetInfo.token)}/>
    </Surface>
  );
  
};

export default NewPasswordOnReset;
