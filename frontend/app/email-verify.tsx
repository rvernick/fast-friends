import { ensureString } from '@/common/utils';
import { EmailVerifyComponent } from '@/components/account/EmailVerifyComponent';
import { useLocalSearchParams } from 'expo-router';

export default function verifyEmail() {
  const search = useLocalSearchParams();
  console.log("verifyEmail: " + JSON.stringify(search));
  return (
    <EmailVerifyComponent token={ensureString(search.token)} email={ensureString(search.email)}/>
  );
}
