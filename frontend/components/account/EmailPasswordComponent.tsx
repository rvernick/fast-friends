import React, { useContext, useState } from "react";
import { GlobalStateContext } from "../../common/GlobalContext";
import { invalidPasswordMessage, isValidEmail, isValidPassword, login } from '../../common/utils';
import { ThemedView } from "../ThemedView";
import { Button, TextInput, HelperText } from "react-native-paper";
import { router } from "expo-router";
import CreateAccountController from "./CreateAccountController";


interface EmailPasswordComponentProps {
  controller: CreateAccountController;
}

export const EmailPasswordComponent: React.FC<EmailPasswordComponentProps> = ({ controller }) => {
  const { appContext } = useContext(GlobalStateContext);
  const [email, setEnteredEmail] = useState('');
  const [password, setEnteredPassword] = useState('');
  const [passwordConfirm, setEnteredPasswordConfirm] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');

  console.log('email password context: ' + appContext);

  const updateEmail = function(newText: string) {
    setEnteredEmail(newText);
    setEmailErrorMessage('');
  }
  const updatePassword = function(newText: string) {
    setEnteredPassword(newText);
    setPasswordErrorMessage('');
  }
  const updatePasswordConfirm = function(newText: string) {
    setEnteredPasswordConfirm(newText);
    setPasswordConfirmErrorMessage('');
  }

  const verifyEmail = function() {
    if (isValidEmail(email)) {
      setEmailErrorMessage('');
      return true;
    } else {
      setEmailErrorMessage('Please enter valid email');
      return false;
    }
  }

  const verifyPassword = function() {
    if (isValidPassword(password)) {
      setPasswordErrorMessage('');
      return true;
    } else {
      setPasswordErrorMessage(invalidPasswordMessage);
      return false;
    }
  }

  const verifyPasswordMatch = function() {
    if (password != passwordConfirm) {
      setPasswordConfirmErrorMessage('Passwords must match');
      return false;
    }
    return true;
  }

  const accountInfoValid = function() {
    return verifyEmail()
      && verifyPassword()
      && verifyPasswordMatch();
  };

  const apply = async function() {
    if (!accountInfoValid()) {
      return;
    }
    const msg = await controller.apply(email, password);
    if (msg) {
      setEmailErrorMessage(msg);
    } else {
      router.replace('sign-in');
    }
  };

  return (
    <ThemedView>
      <TextInput
        label="Email"
        value={email}
        onChangeText={updateEmail}
        mode="outlined"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <HelperText type="error" disabled={emailErrorMessage.length == 0} visible={emailErrorMessage.length > 0}>
        {emailErrorMessage}
      </HelperText>
      <TextInput
        label="Password"
        value={password}
        onChangeText={updatePassword}
        mode="outlined"
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        label="Confirm Password"
        value={passwordConfirm}
        mode="outlined"
        onChangeText={updatePasswordConfirm}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <HelperText type="error" visible={passwordErrorMessage.length > 0} style={{ marginTop: 10 }}>
        {passwordErrorMessage}
      </HelperText>
      <Button mode="contained" onPress={apply}>
        Sign Up
      </Button>
    </ThemedView>
    );
};