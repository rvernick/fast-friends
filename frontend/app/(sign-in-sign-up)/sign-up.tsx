import AppContext from '@/common/app-context';
import { useGlobalContext } from '@/common/GlobalContext';
import CreateAccountController from '@/components/account/CreateAccountController';
import { EmailPasswordComponent } from '@/components/account/EmailPasswordComponent';
import { router } from 'expo-router';
import { Text, Surface } from 'react-native-paper';

export default function SignUp() {
  const appContext = useGlobalContext();
  return (
    <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium">Fast Friends</Text>
      <Text>Welcome to Fast Friends, the on-line platform to assist you with bike maintenance</Text>
      <Text>You think about your rides and who you want to ride with next.</Text>
      <Text>We'll think about your bike needs so you don't have to</Text>
      <Text> </Text>
      <EmailPasswordComponent controller={new CreateAccountController(appContext)}/>
      <Text onPress={() => router.replace('/(sign-in-sign-up)/sign-in')} >
        Already have an account? Sign In
      </Text>
    </Surface>
  );
}
