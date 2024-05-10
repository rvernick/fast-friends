import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import NewPasswordOnResetController from './NewPasswordOnResetController';

export const NewPasswordOnReset = ({ route, navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new NewPasswordOnResetController(appContext);
  const [password, setEnteredPassword] = useState('');
  const [passwordConfirm, setEnteredPasswordConfirm] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');

  console.log('create account context: ' + appContext);
  console.log('tokenpt: ' + route.params.token);

  const token = route.params.token;

  const updatePassword = function(newText: string) {
    setEnteredPassword(newText);
    setPasswordErrorMessage('');
  }
  const updatePasswordConfirm = function(newText: string) {
    setEnteredPasswordConfirm(newText);
    setPasswordConfirmErrorMessage('');
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
    return verifyPassword()
      && verifyPasswordMatch();
  };

  const resetPassword = function() {
    if(accountInfoValid()) {
      const response = controller.updatePassword(token, password);
      response.then(msg => {
          console.log('create acct ' + msg);
          if (msg) {
            setPasswordErrorMessage(msg);
          } else {
            navigation.replace('Login');
          }
        })
    }
  };

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
          <Button onPress={ resetPassword } isDisabled={passwordConfirmErrorMessage.length > 0} mt="2" colorScheme="indigo">
            Reset Password
          </Button>
          <HStack mt="6" justifyContent="center">
            <Button
              variant={'ghost'}
              onPress={() => navigation.replace('Login')}
              testID="createAccountButton">
                Go To Login
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>;
};
