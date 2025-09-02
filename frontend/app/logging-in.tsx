import { ensureString, fetchUser, forget, isDevelopment, remind } from '@/common/utils';
import { useSession } from '@/common/ctx';
import { User } from '@/models/User';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, Surface } from 'react-native-paper';

/**
 * This component will help find the right landing page after the user logs in.
 * Initially, it checks to see if the user has configured their account.
 * Later, it should assist with deep linking and navigation.
 * @returns
 */
export default function LoggingIn() {
  const session = useSession();
  const navigation = useNavigation();
  const [redirecting, setRedirecting] = useState(false);

  const needsMaintenanceItems = async (user: User) => {
    if (!user) return false;
    if (user?.bikes == null || user?.bikes.length === 0) return true;
    var needsItems = true;
    user.bikes.forEach(bike => {
      if (bike.maintenanceItems && bike.maintenanceItems.length > 0) {
        needsItems = false;
        return false;
      }
    })
    return needsItems;
  };

  const routeToNextAppropriatePage = async () => {
    if (redirecting) {
      return;
    }
    try {
      const user = await fetchUser(session, ensureString(session.email));
      if (!user) {
        console.log('redirecting to sign-in');
        router.replace('/(sign-in-sign-up)/(sign-in)/sign-in');
        return;
      }
      setRedirecting(true);
      if (!user.emailVerified) {
        if (isDevelopment()) console.log('waiting for email verification', user);
        router.replace('/(sign-in-sign-up)/wait-for-verification');
        return;
      }
      if (await needsMaintenanceItems(user)) {
        console.log('redirecting to settings');
        router.replace('/(home)/(settings)/getting-started');
        return;
      }
      router.replace('/(home)/(maintenanceItems)/maintenance');
    } finally {
      setRedirecting(false);
    };
  };

  const attempRouteToDeepLink = async (): Promise<boolean> => {
    const deepLink = await remind('ff.deeplink');
    const params = await remind('ff.deeplinkParams');
    console.log('deeplink: ', await remind('ff.deeplink'));

    console.log('deepLink: ', deepLink);
    const paramObject = JSON.parse(params);
    var result = false;
    if (deepLink.length > 0) {
      forget('ff.deeplink');
      forget('ff.deeplinkParams');
      console.log('forgotten: ', await remind('ff.deeplink'));
      switch (deepLink) {
        case '/log-maintenance': {
          console.log('redirecting to log maintenance');
          router.replace({pathname: '/(home)/(maintenanceItems)/log-maintenance', params: paramObject});
          result = true;
          break;
        }
        case '/instructions': {
          console.log('redirecting to instructions');
          router.replace({pathname: '/(home)/(assistance)/instructions', params: paramObject});
          result = true;
          break;
        }
        default: {
          break;
        }
      }
    }

    return result;
  }

  useEffect(() => {
    try {
      // console.log('redirecting if: ', session.jwt_token);
      if (session.jwt_token) {
        routeToNextAppropriatePage();
      }
    } catch (error) {
      console.log('error during login: ', error);
    }
  }, [session]);

  return (
    <Surface>
      <ActivityIndicator animating={true} size="large" />
      <Text>Setting Up</Text>
      </Surface>
  );
};
