import { router } from 'expo-router';

import { useSession } from '@/ctx';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LoginScreen } from '@/components/account/LoginComponent';

export default function SignOut() {
  const session = useSession();
  router.replace('/sign-in');
  session.signOut();
}
