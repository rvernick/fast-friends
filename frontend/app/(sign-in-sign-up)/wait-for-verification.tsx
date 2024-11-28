import { useSession } from '@/ctx';
import { Card, Surface, Text } from 'react-native-paper';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ensureString, forget, isMobile } from '@/common/utils';
import { Dimensions } from 'react-native';
import { createStyles, styles } from '@/common/styles';
import { post } from '@/common/http-utils';

export default function WaitForVerification() {
  const session = useSession();
  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

  const startEmailVerification = async () => {
    try {
      const body = {
        username: session.email,
      };

      console.log('start verification called: ' + JSON.stringify(body));
      const response = await post('/auth/verify-email', body, ensureString(session.jwt_token));
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Update Account';
    }
  }

  useEffect(() => {
    startEmailVerification();
  }, []);

    return (
    <Surface style={useStyle.container}>
      <Card mode="contained" style={useStyle.containerCentered} >
        <Text style={{textAlign: "center"}} variant="headlineMedium">Pedal Assistant</Text>
        <Text style={{textAlign: "center"}}>Welcome to Pedal Assistant, the on-line platform to assist you with bike maintenance</Text>
        <Text style={{textAlign: "center"}}>We'll think about your bike needs so you don't have to</Text>
        <Text> </Text>
        <Text style={{textAlign: "center"}}>Check your email for a verification link.  Click the link to finish sign-in.</Text>
        <Text> </Text>
        <Text> </Text>
      </Card>
    </Surface>
  );
}
