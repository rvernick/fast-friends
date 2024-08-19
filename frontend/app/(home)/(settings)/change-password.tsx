import { useSession } from '@/ctx';
import { ChangePasswordComponent } from '@/components/settings/ChangePasswordComponent';
import { Surface } from 'react-native-paper';

export default function ChangePassword() {
  const { signIn } = useSession();
  return (
    <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ChangePasswordComponent/>
    </Surface>
  );
}
