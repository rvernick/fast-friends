import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import CreateAccountController from './CreateAccountController';
import { login } from '../common/utils';

export const CreateAccount = ({ navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new CreateAccountController(appContext);
  const [email, setEnteredEmail] = useState('');
  const [password, setEnteredPassword] = useState('');
  const [passwordConfirm, setEnteredPasswordConfirm] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');

  console.log('create account context: ' + appContext);

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
    const msg = controller.verifyEmail(email);
    setEmailErrorMessage(msg);
    console.log('CA: email error message: ' + msg);
    return msg.length == 0;
  }
  const verifyPassword = function() {
    const msg = controller.verifyPassword(password)
    console.log('UI verify password: ' + msg);
    setPasswordErrorMessage(msg);
    return msg.length == 0;
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

  const createAccount = function() {
    if(accountInfoValid()) {
      const response = controller.createAccount(email, password);
      response.then(msg => {
          console.log('create acct ' + msg);
          if (msg) {
            setEmailErrorMessage(msg);
          } else {
            attemptLogin(email, password);
          }
        })
    }
  };

  const attemptLogin = function(email: string, password: string) {
    console.log('attempt login ' + appContext);
    const loginMessage = login(email, password, appContext);
    loginMessage.then(msg => {
      console.log('loginAttempt: ' + msg);
      if (msg) {
        setEmailErrorMessage(msg);
      } else {
//        navigation.replace('FinishAccount');
      }
    });
  }


  return <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          Fast Friends
        </Heading>
        <Heading mt="1" _dark={{
        color: "warmGray.200"
      }} color="coolGray.600" fontWeight="medium" size="xs">
          Create Account
        </Heading>

        <VStack space={3} mt="5">
          <FormControl testID="emailForm" isRequired isInvalid={emailErrorMessage.length > 0}>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input
              onChangeText={updateEmail}
              testID="emailInput"
              onBlur={verifyEmail}
              />
            <FormControl.ErrorMessage
              testID="emailError"
              leftIcon={<WarningOutlineIcon size="xs" />}>
                { emailErrorMessage }
              </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={passwordErrorMessage.length > 0} >
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              onChangeText={updatePassword}
              onBlur={verifyPassword}
              testID="passwordInput"
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                { passwordErrorMessage }
              </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={passwordConfirmErrorMessage.length > 0}>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input
              type="password"
              onChangeText={updatePasswordConfirm}
              testID="confirmPasswordInput"
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              { passwordConfirmErrorMessage }
              </FormControl.ErrorMessage>
          </FormControl>
          <Button onPress={ createAccount } isDisabled={emailErrorMessage.length > 0 ||  passwordConfirmErrorMessage.length > 0} mt="2" colorScheme="indigo">
            Create Account
          </Button>
          <HStack mt="6" justifyContent="center">
            <Button
              variant={'ghost'}
              onPress={() => navigation.replace('Login')}
              testID="createAccountButton">
                I have an account
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>;
};
