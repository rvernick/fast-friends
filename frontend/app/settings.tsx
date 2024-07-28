import { SettingsComponent } from "@/components/settings/SettingsComponent"
import { ThemedView } from "@/components/ThemedView"

export default function SettingsScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SettingsComponent/>
    </ThemedView>
  )
}