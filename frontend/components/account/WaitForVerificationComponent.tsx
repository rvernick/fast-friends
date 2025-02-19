import { useSession } from '@/common/ctx';
import { useEffect, useState } from 'react';
import { ensureString, fetchUser } from '@/common/utils';
import { post } from '@/common/http-utils';
import { router } from 'expo-router';
import { useGlobalContext } from '@/common/GlobalContext';
import WaitForVerificationController from './WaitForVerificationController';
import { BaseLayout } from '../layouts/base-layout';
import { VStack } from '../ui/vstack';
import { Link, LinkText } from '../ui/link';
import { Button, ButtonText } from '../ui/button';
import { Alert, AlertIcon, AlertText } from '../ui/alert';
import { Input, InputField } from '../ui/input';
import { InfoIcon } from '../ui/icon';
import { Heading } from '../ui/heading';
import { Text } from '../ui/text';

const tenMinutesInSeconds = 10 * 60;

export const WaitForVerificationComponent = () => {
  const appContext = useGlobalContext();
  const session = useSession();
  const controller = new WaitForVerificationController(appContext);
  const [code, setCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [startedVerification, setStartedVerification] = useState(false);
  
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
    <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md">
        <VStack className="md:items-center" space="md">
          <VStack>
            <Heading className="text-center" size="3xl">
              Verify Email
            </Heading>
            <Text className="text-center">Pedal Assistant, the Strava powered maintenance tracker</Text>
            <Text className="text-center">You think about your rides</Text>
            <Text className="text-center">We'll think about your bike needs so you don't have to</Text>
            <Text> </Text>
            <Text className="text-center">Check your email for a verification code.  Enter the code. </Text>
            <Text> </Text>
          </VStack>
        </VStack>
        <VStack className="w-full">
          <VStack space="md" className="w-full"></VStack>
            <Text>Verification Code</Text>
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField 
                value={code}
                multiline={false}
                onChangeText={updateCode}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                testID="verificationCodeInput"
                accessibilityLabel="Verification Code Input"
                accessibilityHint="Enter the verification code you received in your email"
                placeholder="Enter verification code..." />
            </Input>
            {showError ? (
              <Alert action="error" variant="outline">
                <AlertIcon as={InfoIcon} />
                <AlertText>Incorrect Verification Code</AlertText>
              </Alert>)
             : <Text> </Text>}
            <Button className="bottom-button" size="md" variant="solid"
                action="primary" 
                onPress={submitCode}
                testID="submitButton"
                accessibilityLabel="Submit Button"
                accessibilityHint="The button to submit the info to verify email">
              <ButtonText>Submit</ButtonText>
            </Button>
            <Button className="bottom-button" size="md" variant="solid"
                action="secondary" 
                onPress={startEmailVerification}
                testID="resendButton"
                accessibilityLabel="Resend Code Button"
                accessibilityHint="The button to request a new verification code">
              <ButtonText>Resend Verification Code</ButtonText>
            </Button>
        </VStack>
      </VStack>
    </BaseLayout>
  );
};
