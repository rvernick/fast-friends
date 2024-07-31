import { router } from 'expo-router';

import { useSession } from '@/ctx';
import { ThemedView } from '@/components/ThemedView';
import { Button } from'react-native-paper';
import { ChangePasswordComponent } from '@/components/settings/ChangePasswordComponent';

export default function ChangePassword() {
  const { signIn } = useSession();
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ChangePasswordComponent/>
      <Button onPress={() => router.back()}>
        Cancel
      </Button>
    </ThemedView>
  );
}
