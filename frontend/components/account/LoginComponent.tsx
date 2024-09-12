import React, { useEffect, useState } from "react";
import { GestureResponderEvent, NativeSyntheticEvent, Platform, TextInputChangeEventData, TextInputSubmitEditingEventData } from "react-native";
import { useGlobalContext } from "../../common/GlobalContext";
import { forget, login, remind } from "../../common/utils";
import { baseUrl } from "../../common/http-utils";
import { ActivityIndicator, Button, HelperText, Text } from "react-native-paper";
import { router } from "expo-router";
import { Card, TextInput, Surface } from 'react-native-paper';
import * as LocalAuthentication from 'expo-local-authentication';

export const LoginComponent = () => {
  const appContext = useGlobalContext();
  var user = '';
  var pword = '';

  if (baseUrl().includes('localhost:') || baseUrl().includes('')) {
    user = 't5@t.com';
    pword = 'h@ppyHappy';
  }

  const [email, setEnteredEmail] = useState(user);
  const [password, setEnteredPassword] = useState(pword);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';
  const [useFaceRecognition, setUseFaceRecognition] = useState(isMobile);
  const [canUseFaceId, setCanUseFaceId] = useState(false);

  const updateEmail = function(newText: string) {
    setLoginErrorMessage('');
    setEnteredEmail(newText);
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
    if (!isMobile) {
      setUseFaceRecognition(false);
      setCanUseFaceId(false);
      return false;
    }
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
    const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
    const lastUser =  await remind('ff.username');
    const lastPass = await remind('ff.password');
    if ( !isMobile
      || !hasHardware
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
      <ActivityIndicator animating={useFaceRecognition} testID="activity"></ActivityIndicator>
        <Card>
          <Card.Title title="Fast Friends"></Card.Title>
          <Card.Content>
              <TextInput
                  label="Email"
                  keyboardType="email-address"
                  onChangeText={updateEmail}
                  testID="emailInput"/>
              <TextInput label="Password"
                  secureTextEntry={true}
                  onChangeText={updatePassword}
                  onSubmitEditing={loginSubmit}
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
