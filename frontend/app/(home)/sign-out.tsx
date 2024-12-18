import { useSession } from '@/common/ctx';
import { Surface, Text } from 'react-native-paper';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { forget } from '@/common/utils';

export default function SignOut() {
  const session = useSession();
  const queryClient = useQueryClient();

  const signOut = () => {
    forget("ff.username");
    forget("ff.password");
    forget('ff.deeplink');
    forget('ff.deeplinkParams');
    session.signOut();
  }

  useEffect(() => {
    try {
      signOut();
      queryClient.clear();
    } catch (error) {
      console.log('error during logout: ', error);
    }
  }, []);

  return (
    <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Signing out...</Text>
    </Surface>
  );
}
