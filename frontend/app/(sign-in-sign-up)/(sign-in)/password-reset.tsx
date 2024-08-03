import { ThemedView } from '@/components/ThemedView';
import { PasswordResetComponent } from '@/components/account/PasswordResetComponent';

export default function PasswordReset() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PasswordResetComponent/>
    </ThemedView>
  );
}
