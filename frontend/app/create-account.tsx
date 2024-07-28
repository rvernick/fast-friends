import AppContext from '@/common/app-context';
import { useGlobalContext } from '@/common/GlobalContext';
import CreateAccountController from '@/components/account/CreateAccountController';
import { EmailPasswordComponent } from '@/components/account/EmailPasswordComponent';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';

export default function SignIn() {
  const appContext = useGlobalContext();
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <EmailPasswordComponent controller={new CreateAccountController(appContext)}/>
      <Text onPress={() => router.replace('sign-in')} >
        Already have an account? Sign In
      </Text>
    </ThemedView>
  );
}
