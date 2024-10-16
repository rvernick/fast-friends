import { ensureString, fetchUser } from '@/common/utils';
import { useSession } from '@/ctx';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, Surface } from 'react-native-paper';

/**
 * This component will help find the right landing page after the user logs in.
 * Initially, it checks to see if the user has configured their account.
 * Later, it should assist with deep linking and navigation.
 * @returns 
 */
export default function LoggingIn() {
  const session = useSession();

  const unconfiguredAccount = async () => {
    const user = await fetchUser(session, ensureString(session.email));
    return ensureString(user?.firstName) === ''
      && ensureString(user?.lastName) === ''
      && (user?.bikes == null || user?.bikes.length === 0);
  };

  const routeToNextAppropriatePage = async () => {
    if (await unconfiguredAccount()) {
      console.log('redirecting to settings');
      router.replace('/(home)/(settings)/settings');
      return;
    }
    router.replace('/(home)');
  };
 
  useEffect(() => {
    try {
      console.log('redirecting if: ', session.jwt_token);
      if (session.jwt_token) {
        routeToNextAppropriatePage();
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
