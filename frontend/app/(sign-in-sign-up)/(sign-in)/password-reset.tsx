import { router } from 'expo-router';

import { useSession } from '@/ctx';
import { ThemedView } from '@/components/ThemedView';
import { Text } from 'react-native-paper';

export default function PasswordReset() {
  const { signIn } = useSession();
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          signIn('jwt_token', 'email@example.com');
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/(home)');
        }}>
        Sign In
      </Text>
    </ThemedView>
  );
}
