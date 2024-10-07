import { Redirect, router } from 'expo-router';

import { useSession } from '@/ctx';
import { Surface, Text } from 'react-native-paper';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function SignOut() {
  const session = useSession();
  const queryClient = useQueryClient();

  const signOut = () => {
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
