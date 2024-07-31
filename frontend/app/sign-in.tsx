import { ThemedView } from '@/components/ThemedView';
import { LoginScreen } from '@/components/account/LoginComponent';

export default function SignIn() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LoginScreen/>
    </ThemedView>
  );
}
