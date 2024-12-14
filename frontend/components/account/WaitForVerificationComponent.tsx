import { useSession } from '@/ctx';
import { Button, Card, HelperText, Surface, Text, TextInput } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { ensureString, fetchUser, isMobile, sleep } from '@/common/utils';
import { Dimensions } from 'react-native';
import { createStyles, defaultWebStyles } from '@/common/styles';
import { post } from '@/common/http-utils';
import { router, useNavigation } from 'expo-router';
import { useGlobalContext } from '@/common/GlobalContext';
import WaitForVerificationController from './WaitForVerificationController';

const tenMinutesInSeconds = 10 * 60;

export const WaitForVerificationComponent = () => {
  const appContext = useGlobalContext();
  const session = useSession();
  const controller = new WaitForVerificationController(appContext);
  const [code, setCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [startedVerification, setStartedVerification] = useState(false);
  
  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

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

  const updateCode = (newCode: string) => {
    if (newCode.length < code.length) {
      setFirstAttempt(false);
    }
    setCode(newCode);
    setShowError(false);
    if (firstAttempt && newCode.length === 6) {
      setFirstAttempt(false);
      attemptSubmitCode(newCode);
    }
  }

  const submitCode = async () => {
    attemptSubmitCode(code);
  }

  const attemptSubmitCode = async (verificationCode: string) => {
    if (await controller.submitCode(verificationCode, session)) {
      const user = await fetchUser(session, ensureString(session.email));
      if (user && user.emailVerified) {
        console.log('verification successful');
        router.replace('/logging-in');
      } else {
        console.log('verification failed');
        setShowError(true);
      }
    }
  }

  useEffect(() => {
    if (!startedVerification) {
      startEmailVerification();
      setStartedVerification(true);
    }
  }, []);

  return (
    <Surface style={useStyle.container}>
      <Card mode="contained" style={useStyle.containerCentered} >
        <Text style={{textAlign: "center"}} variant="headlineMedium">Pedal Assistant</Text>
        <Text style={{textAlign: "center"}}>Welcome to Pedal Assistant, the on-line platform to assist you with bike maintenance</Text>
        <Text style={{textAlign: "center"}}>We'll think about your bike needs so you don't have to</Text>
        <Text style={{textAlign: "center"}}>If you have any difficulty, contact us: support@pedal-assistant.com</Text>
        <Text> </Text>
        <Text style={{textAlign: "center"}}>Check your email for a verification code.  Enter the code.</Text>
        <Text> </Text>
        <Card style={{height: 150, margin: 12, borderWidth: 1, padding: 10,}}>
        <TextInput
          label="Verification Code"
          value={code}
          multiline={false}
          onChangeText={updateCode}
          mode="outlined"
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          testID="verificationCodeInput"
          accessibilityLabel="Verification Code Input"
          accessibilityHint="Enter the verification code you received in your email"
          />
          <HelperText type={'error'} visible={showError}>Incorrect Verification Code</HelperText>
        <Button onPress={submitCode} mode="contained"> Submit </Button>
        </Card>
        <Text> </Text>
        <Button onPress={startEmailVerification}> Resend Verification Code </Button>
      </Card>
    </Surface>
  );
}
