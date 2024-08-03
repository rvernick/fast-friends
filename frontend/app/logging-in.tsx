import { ThemedView } from '@/components/ThemedView';
import { LoginScreen } from '@/components/account/LoginComponent';
import { useSession } from '@/ctx';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';

export default function LoggingIn() {
  const session = useSession();
 
  useEffect(() => {
    console.log('redirecting if: ', session.jwt_token);
    if (session.jwt_token != null) {
      router.replace('/(home)');
    }
  }, [session]);

  return (
    <ThemedView>
      <ActivityIndicator animating={true} />
      <Text>Setting Up</Text>
      </ThemedView>
  );
};
