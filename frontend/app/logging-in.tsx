import { useSession } from '@/ctx';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, Surface } from 'react-native-paper';

export default function LoggingIn() {
  const session = useSession();
 
  useEffect(() => {
    try {
      console.log('redirecting if: ', session.jwt_token);
      if (session.jwt_token != null) {
        router.replace('/(home)');
      }
    } catch (error) {
      console.log('error during login: ', error);
    }
  }, [session]);

  return (
    <Surface>
      <ActivityIndicator animating={true} />
      <Text>Setting Up</Text>
      </Surface>
  );
};
