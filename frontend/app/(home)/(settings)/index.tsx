import { router } from 'expo-router';

import { useSession } from '@/ctx';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/(home)');
        }}>
        Index - just goes home for now
      </ThemedText>
    </ThemedView>
  );
}
