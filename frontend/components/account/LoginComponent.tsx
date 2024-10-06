import React, { useEffect, useState } from "react";
import { Dimensions, GestureResponderEvent, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { useGlobalContext } from "../../common/GlobalContext";
import { forget, login, remind, isMobile } from '@/common/utils';
import { baseUrl } from "../../common/http-utils";
import { ActivityIndicator, Button, HelperText, IconButton, Text } from "react-native-paper";
import { router } from "expo-router";
import { Card, TextInput, Surface } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';
import { createStyles, styles } from "@/common/styles";

export const LoginComponent = () => {
  const appContext = useGlobalContext();
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
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles;

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
    const loginAttempt = login(username, pass, appContext);
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
    forget('ff.username');
    forget('ff.password');
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
    } else {
      setCanUseFaceId(true);
      return true;
    }
    return false;
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
        setUseFaceRecognition(false);
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
    <Surface>
      <Text style={{textAlign: "center"}} variant="headlineMedium">Pedal Assistant</Text>

      <ActivityIndicator animating={useFaceRecognition} testID="activity"></ActivityIndicator>
        <Card >
          <Card.Content>
              <TextInput
                  label="Email"
                  keyboardType="email-address"
                  onChangeText={updateEmail}
                  value={email}
                  autoComplete="email"
                  testID="emailInput"/>
              <TextInput label="Password"
                  secureTextEntry={passwordHidden}
                  onChangeText={updatePassword}
                  onSubmitEditing={loginSubmit}
                  value={password}
                  right={<TextInput.Icon icon="eye" onPress={() => setPasswordHidden(!passwordHidden)}/>}
                  testID="passwordInput"/>
              <HelperText 
                  type="error"
                  visible={loginErrorMessage.length > 0}
                  testID="loginError">
                {loginErrorMessage}
              </HelperText>
              <Button mode="contained" onPress={loginButton}>
                Confirm
              </Button>
              <Button onPress={() => router.push('/(sign-in)/password-reset')}>
                Forgot email/password
              </Button>
              <Button onPress={() => router.replace('/(sign-in-sign-up)/sign-up')}>
                Sign Up
              </Button>
              {canUseFaceId ? (
                <Button onPress={loginWithFaceRecognition}>
                  [ Use Face ID ]
                </Button>
              ) : null}
          </Card.Content>
        </Card>  
    </Surface>
  );
}
