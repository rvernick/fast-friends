import { ensureString } from "@/common/utils";
import { NewPasswordOnResetComponent } from "@/components/account/NewPasswordOnResetComponent";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";

const NewPasswordOnReset = () => {
  const resetInfo = useLocalSearchParams();

  return (
    <ThemedView>
      <NewPasswordOnResetComponent token={ensureString(resetInfo.token)}/>
    </ThemedView>
  );
  
};

export default NewPasswordOnReset;
