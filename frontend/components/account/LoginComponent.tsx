import React, { useEffect, useState } from "react";
import { Dimensions, GestureResponderEvent, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { login, remind, isMobile } from '@/common/utils';
import { baseUrl } from "../../common/http-utils";
import { ActivityIndicator, Button, HelperText, IconButton, Text } from "react-native-paper";
import { router } from "expo-router";
import { Card, TextInput, Surface } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';
import { createStyles, defaultWebStyles } from "@/common/styles";
import { useSession } from "@/ctx";

export const LoginComponent = () => {
  const session = useSession();
  
  var user = '';
  var pword = '';

  if (baseUrl().includes('localhost:')) {
    user = 't5@t.com';
    pword = 'h@ppyHappy';
  }

  const [email, setEnteredEmail] = useState(user);
  const [password, setEnteredPassword] = useState(pword);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [useFaceRecognition, setUseFaceRecognition] = useState(isMobile());
  const [canUseFaceId, setCanUseFaceId] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles;

  const updateEmail = function(newText: string) {
    setLoginErrorMessage('');
    setEnteredEmail(newText.toLocaleLowerCase());
  }

  const updatePassword = function(newText: string) {
    setLoginErrorMessage('');
    setEnteredPassword(newText);
  }

  const loginButton = function(e: GestureResponderEvent) {
    e.preventDefault();
    attemptLogin();
  };

  const loginSubmit = function(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
      e.preventDefault();
      attemptLogin();
    };

  const attemptLogin = function() {
    attemptLoginUsing(email, password);
  }

  const attemptLoginUsing = (username: string, pass: string) => {
    const loginAttempt = login(username, pass, session);
    loginAttempt
      .then(msg => {
        console.log('loginAttempt: ' + msg);
        if (msg) {
          setLoginErrorMessage(msg);
          turnOffFaceRecognition();
        } else {
          console.log('attemptLogin successful');
          router.replace('/logging-in');
        }
      })
      .catch(error => {
        console.log('Failed to log in ' + error.message);
        setLoginErrorMessage(error.message);
        turnOffFaceRecognition();
      });
  };

  const turnOffFaceRecognition = () => {
    setUseFaceRecognition(false);
  }

  const attemptLoginViaDeviceId = async () => {
    const lastUser = await remind('ff.username');
    const lastPass = await remind('ff.password');
    if (lastUser && lastPass) {
      attemptLoginUsing(lastUser, lastPass);
    } else {
      turnOffFaceRecognition();
    }
  }

  const confirmUseFaceRecognition = async () => {
    if (!isMobile()) {
      setUseFaceRecognition(false);
      setCanUseFaceId(false);
      return false;
    }
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
    const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
    const lastUser =  await remind('ff.username');
    const lastPass = await remind('ff.password');
    if ( !hasHardware
      || !hasBiometrics
      || !types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
      || !(lastUser && lastUser.length > 0)
      || !(lastPass && lastPass.length > 0)) {
      setUseFaceRecognition(false);
      setCanUseFaceId(false);
      return false;
    } else {
      setCanUseFaceId(true);
      return true;
    }
  }

  const loginWithFaceRecognition = async () => {
    const confirm = await confirmUseFaceRecognition();
    if (confirm) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your face to log in',
        cancelLabel: 'Cancel',
      });
      if (result.success) {
        console.log('Face ID login successful');
        attemptLoginViaDeviceId();
      } else {
        console.log('Face ID login failed');
        turnOffFaceRecognition();
        setLoginErrorMessage('Face ID login failed');
      }
    }
  }

  useEffect(() => {
    if (useFaceRecognition) {
      loginWithFaceRecognition();
    }
    if (!canUseFaceId) {
      confirmUseFaceRecognition();
    }
  }, [useFaceRecognition, canUseFaceId]);

  if (useFaceRecognition && canUseFaceId) {
    return (
      <Surface>
        <Text>Face Recognition</Text>
      </Surface>
    );
  }
  return (
    <Surface style={useStyle.container}>
      <Text style={{textAlign: "center"}} variant="headlineMedium">Pedal Assistant</Text>

      <ActivityIndicator animating={useFaceRecognition} testID="activity" size="large"/>
      <Card >
        <Card.Content>
            <TextInput
                label="Email"
                keyboardType="email-address"
                inputMode="email"
                textContentType="emailAddress"
                onChangeText={updateEmail}
                value={email}
                autoComplete="email"
                autoCapitalize="none"
                testID="emailInput"
                accessibilityLabel="email input"
                accessibilityHint="The email address for the account being logged in"/>
            <TextInput label="Password"
                secureTextEntry={passwordHidden}
                inputMode="text"
                textContentType="password"
                autoCapitalize="none"
                onChangeText={updatePassword}
                onSubmitEditing={loginSubmit}
                value={password}
                right={<TextInput.Icon icon="eye" onPress={() => setPasswordHidden(!passwordHidden)}/>}
                testID="passwordInput"
                accessibilityLabel="password input"
                accessibilityHint="The password for the account being logged in"/>
            <HelperText 
                type="error"
                visible={loginErrorMessage.length > 0}
                testID="loginError">
              {loginErrorMessage}
            </HelperText>
            <Button
              mode="contained"
              onPress={loginButton}
              testID="loginButton"
              accessibilityLabel="confirm button"
              accessibilityHint="Will attempt to login based on the user and password entered">
              Confirm
            </Button>
            <Button
              onPress={() => router.push('/(sign-in)/password-reset')}
              accessibilityLabel="forgot password button"
              accessibilityHint="Go to the screen to request a password reset">
              Forgot email/password
            </Button>
            <Button
              onPress={() => router.replace('/(sign-in-sign-up)/sign-up')}
              accessibilityLabel="Sign Up button"
              accessibilityHint="Go to the create account screen">
              Sign Up
            </Button>
            {canUseFaceId ? (
              <Button onPress={() => setUseFaceRecognition(true)}>
                [ Use Face ID ]
              </Button>
            ) : null}
        </Card.Content>
      </Card>  
    </Surface>
  );
}
