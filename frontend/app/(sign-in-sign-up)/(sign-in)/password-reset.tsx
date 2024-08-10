import { PasswordResetComponent } from '@/components/account/PasswordResetComponent';
import { Surface } from 'react-native-paper';

export default function PasswordReset() {
  return (
    <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PasswordResetComponent/>
    </Surface>
  );
}
