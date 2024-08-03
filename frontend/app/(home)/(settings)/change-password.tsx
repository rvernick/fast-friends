import { useSession } from '@/ctx';
import { ThemedView } from '@/components/ThemedView';
import { ChangePasswordComponent } from '@/components/settings/ChangePasswordComponent';

export default function ChangePassword() {
  const { signIn } = useSession();
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ChangePasswordComponent/>
    </ThemedView>
  );
}
