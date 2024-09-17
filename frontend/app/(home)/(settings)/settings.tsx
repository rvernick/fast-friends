import { ensureString } from "@/common/utils";
import { SettingsComponent } from "@/components/settings/SettingsComponent"
import { Surface } from 'react-native-paper'
import { useLocalSearchParams } from "expo-router";

export default function SettingsScreen() {
  const search = useLocalSearchParams();
  const stravaid = search.stravaid || '';
  console.log("SettingsScreen stravaid: " + stravaid);
  return (
    <Surface>
      <SettingsComponent strava_id={ensureString(stravaid)} />
    </Surface>
  )
}
