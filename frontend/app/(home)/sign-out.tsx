import { Redirect, router } from 'expo-router';

import { useSession } from '@/ctx';
import { ThemedView } from '@/components/ThemedView';
import { Text } from 'react-native-paper';
import { useEffect } from 'react';

// useEffect(() => {  
//   router.replace('/');
// }, []);

export default function SignOut() {
  const session = useSession();
  session.signOut();
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Signing out...</Text>
    </ThemedView>
  );
}
