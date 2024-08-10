import { Surface } from 'react-native-paper'
import { LoginComponent } from '@/components/account/LoginComponent';

export default function SignIn() {
  return (
    <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LoginComponent/>
    </Surface>
  );
}
