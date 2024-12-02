import { ensureString, fetchUser } from '@/common/utils';
import { useSession } from '@/ctx';
import { User } from '@/models/User';
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
  const unconfiguredAccount = async (user: User) => {
    if (!user) return false;
    return ensureString(user?.firstName) === ''
      && ensureString(user?.lastName) === ''
      && (user?.bikes == null || user?.bikes.length === 0);
  };

  const routeToNextAppropriatePage = async () => {
    const user = await fetchUser(session, ensureString(session.email));
    if (!user) {
      console.log('redirecting to sign-in');
      router.replace('/(sign-in-sign-up)/(sign-in)/sign-in');
      return;
    }
    // if (!user.emailVerified) {
    //   console.log('waiting for email verification');
    //   router.replace('/(sign-in-sign-up)/wait-for-verification');
    //   return;
    // }
    if (await unconfiguredAccount(user)) {
      console.log('redirecting to settings');
      router.replace('/(home)/(settings)/settings');
      return;
    }
    router.replace('/(home)/maintenance');
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
