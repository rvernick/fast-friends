import { ensureString } from "@/common/utils";
import { SettingsComponent } from "@/components/settings/SettingsComponent"
import { ThemedView } from "@/components/ThemedView"
import { useLocalSearchParams } from "expo-router";

export default function SettingsScreen() {
  const search = useLocalSearchParams();
  const stravaid = search.stravaid || '';
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SettingsComponent strava_id={ensureString(stravaid)} />
    </ThemedView>
  )
}