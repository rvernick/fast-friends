import React, { useContext, useState } from "react";
import { invalidPasswordMessage, isMobile, isValidEmail, isValidPassword, login } from '../../common/utils';
import { Text, Button, TextInput, HelperText, Card, Surface } from "react-native-paper";
import { router } from "expo-router";
import CreateAccountController from "./CreateAccountController";
import { Dimensions } from "react-native";
import { createStyles, styles } from "@/common/styles";

interface CreateAccountComponentProps {
  controller: CreateAccountController;
}

export const CreateAccountComponent: React.FC<CreateAccountComponentProps> = ({ controller }) => {
  const [email, setEnteredEmail] = useState('');
  const [password, setEnteredPassword] = useState('');
  const [passwordConfirm, setEnteredPasswordConfirm] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles;

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
      router.replace('/sign-in');
    }
  };

  
  return (
    <Surface style={useStyle.container}>
      <Text style={{textAlign: "center"}} variant="headlineMedium">Fast Friends</Text>
      <Text style={{textAlign: "center"}}>Welcome to Fast Friends, the on-line platform to assist you with bike maintenance</Text>
      <Text style={{textAlign: "center"}}>You think about your rides and who you want to ride with next.</Text>
      <Text style={{textAlign: "center"}}>We'll think about your bike needs so you don't have to</Text>
      <Text> </Text>
      <Card >
        <Card.Title title="New Account"></Card.Title>
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={updateEmail}
            mode="outlined"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            keyboardType="email-address"
            onBlur={verifyEmail}
            testID="emailInput"
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
            onBlur={verifyPassword}
            testID="passwordInput"
          />
          <TextInput
            label="Confirm Password"
            value={passwordConfirm}
            mode="outlined"
            onChangeText={updatePasswordConfirm}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            testID="passwordConfirmInput"
          />
          <HelperText type="error" visible={passwordErrorMessage.length > 0} style={{ marginTop: 10 }}>
            {passwordErrorMessage}
          </HelperText>
          <Button mode="contained" onPress={apply}>
            Sign Up
          </Button>
          <Text> </Text>
      <Text style={{textAlign: "center"}} onPress={() => router.replace('/(sign-in-sign-up)/sign-in')} >
        Already have an account? Sign In
      </Text>
        </Card.Content>
      </Card>

    </Surface>
    );
};
