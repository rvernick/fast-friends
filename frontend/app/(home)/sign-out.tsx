import { Redirect, router } from 'expo-router';

import { useSession } from '@/ctx';
import { Surface, Text } from 'react-native-paper';
import { useEffect } from 'react';

export default function SignOut() {
  const session = useSession();
  
  const signOut = () => {
    session.signOut();
  }

  useEffect(() => {
    try {
      signOut();
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
