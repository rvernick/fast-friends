import { GlobalStateContext } from '@/common/GlobalContext';
import CreateAccountController from '@/components/account/CreateAccountController';
import { EmailPasswordComponent } from '@/components/account/EmailPasswordComponent';
import { ThemedView } from '@/components/ThemedView';
import { useContext } from 'react';

export default function SignIn() {
  const { appContext } = useContext(GlobalStateContext);
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <EmailPasswordComponent controller={new CreateAccountController(appContext)}/>
    </ThemedView>
  );
}
