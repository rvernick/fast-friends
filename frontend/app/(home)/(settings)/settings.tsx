import { ensureString } from "@/common/utils";
import { SettingsComponent } from "@/components/settings/SettingsComponent"
import { useLocalSearchParams } from "expo-router";

export default function SettingsScreen() {
  const search = useLocalSearchParams();
  const stravaid = search.stravaid || '';
  return (
    <SettingsComponent strava_id={ensureString(stravaid)} />
  )
}
