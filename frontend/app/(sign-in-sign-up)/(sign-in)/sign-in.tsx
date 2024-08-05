import { ThemedView } from '@/components/ThemedView';
import { LoginComponent } from '@/components/account/LoginComponent';

export default function SignIn() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LoginComponent/>
    </ThemedView>
  );
}
