import React, { ChangeEvent, useContext, useState } from "react";
import { GestureResponderEvent, NativeSyntheticEvent, TextInputChangeEventData, TextInputSubmitEditingEventData } from "react-native";
import { useGlobalContext } from "../../common/GlobalContext";
import { login, sleep } from "../../common/utils";
import { baseUrl } from "../../common/http-utils";
import { ThemedView } from "../ThemedView";
import { Button, HelperText } from "react-native-paper";
import { router } from "expo-router";
import { Card, TextInput } from 'react-native-paper';

export const LoginComponent = () => {
  const appContext = useGlobalContext();
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

  return (
    <ThemedView>
        <Card>
          <Card.Title title="Fast Friends"></Card.Title>
          <Card.Content>
              <TextInput label="Email" keyboardType="email-address" onChangeText={updateEmail}></TextInput>
              <TextInput label="Password"
                secureTextEntry={true}
                onChangeText={updatePassword}
                onSubmitEditing={loginSubmit}/>
              <HelperText type="error" visible={loginErrorMessage.length > 0}>{loginErrorMessage}</HelperText>
              <Button mode="contained" onPress={loginButton}>
                Confirm
              </Button>
              <Button onPress={() => router.push('password-reset')}>
              Forgot email/password
              </Button>
              <Button onPress={() => router.replace('sign-up')}>
                Sign Up
              </Button>
          </Card.Content>
        </Card>  
    </ThemedView>
  );
}