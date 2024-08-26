import React, { useState } from "react";
import { GestureResponderEvent, NativeSyntheticEvent, TextInputChangeEventData, TextInputSubmitEditingEventData } from "react-native";
import { useGlobalContext } from "../../common/GlobalContext";
import { login } from "../../common/utils";
import { baseUrl } from "../../common/http-utils";
import { Button, HelperText } from "react-native-paper";
import { router } from "expo-router";
import { Card, TextInput, Surface } from 'react-native-paper';
import { useAuth0 } from "react-native-auth0";
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const LoginComponent = () => {
  const appContext = useGlobalContext();
  const { authorize } = useAuth0();
  
  var user = '';
  var pword = '';

  if (baseUrl().includes('localhost:')) {
    user = 't5@t.com';
    pword = 'h@ppyHappy';
  }
  console.log('user: ' + user);
  const [email, setEnteredEmail] = useState(user);
  const [password, setEnteredPassword] = useState(pword);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

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
    const loginAttempt = login(email, password, appContext);
    loginAttempt
      .then(msg => {
        console.log('loginAttempt: ' + msg);
        if (msg) {
          setLoginErrorMessage(msg);
        } else {
          console.log('attemptLogin successful');
          router.replace('/logging-in');
        }
      })
      .catch(error => {
        console.log('Failed to log in ' + error.message);
        setLoginErrorMessage(error.message);
      });
  };

  const onLogin = async () => {
    try {
      console.log('Logging in with Auth0...');
      await authorize();
      console.log('Logged in with Auth0');
    } catch (e) {
      console.log('authorize failed' + e);
    }
  };

  return (
    <Surface>
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
              <HelperText type="error" visible={loginErrorMessage.length > 0}>{loginErrorMessage}</HelperText>
              <Button mode="contained" onPress={loginButton}>
                Confirm
              </Button>
              <Button onPress={onLogin}>
                Sign In with Auth0
              </Button>
              <Button onPress={() => router.push('/(sign-in)/password-reset')}>
              Forgot email/password
              </Button>
              <Button onPress={() => router.replace('/(sign-in-sign-up)/sign-up')}>
                Sign Up
              </Button>
          </Card.Content>
        </Card>  
    </Surface>
  );
}
