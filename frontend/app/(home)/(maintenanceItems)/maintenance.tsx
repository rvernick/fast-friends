import { ThemedView } from '@/components/ThemedView';
import MaintenanceComponent from '@/components/bikes/MaintenanceComponent';

export default function SignIn() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MaintenanceComponent/>
    </ThemedView>
  );
}
