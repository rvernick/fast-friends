import { router } from 'expo-router';

import { useSession } from '@/ctx';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LoginScreen } from '@/components/account/LoginComponent';

export default function SignIn() {
  const session = useSession();
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText
        onPress={() => {
          session.signIn('jwt_token', 'email@example.com');
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/(home)');
        }}>
        Sign In
      </ThemedText>
      <LoginScreen/>
    </ThemedView>
  );
}
