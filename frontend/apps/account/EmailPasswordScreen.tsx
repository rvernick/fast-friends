import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import { invalidPasswordMessage, isValidEmail, isValidPassword, login } from '../common/utils';

export const EmailPasswordScreen = ({ controller, navigation }) => {
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

  const apply = function() {
    if (!accountInfoValid()) {
      return;
    }
    const msg = controller.apply(email, password);
    if (msg) {
      setEmailErrorMessage(msg);
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
      <Heading mt="1" _dark={{
      color: "warmGray.200"
    }} color="coolGray.600" fontWeight="medium" size="xs">
        {controller.headingText()}
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
          <Button onPress={ apply } isDisabled={emailErrorMessage.length > 0 ||  passwordConfirmErrorMessage.length > 0} mt="2" colorScheme="indigo">
              {controller.buttonText()}
          </Button>
          <HStack mt="6" justifyContent="center">
            <Button
              variant={'ghost'}
              onPress={() => navigation.replace('Login')}
              testID="backToLoginButton">
                  Go To Login
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>);
};
