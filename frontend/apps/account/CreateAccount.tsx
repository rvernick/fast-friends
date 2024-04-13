import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import CreateAccountController from './CreateAccountController';

export const CreateAccount = ({ navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new CreateAccountController(appContext);
  const [email, setEnteredEmail] = useState('');
  const [password, setEnteredPassword] = useState('');
  const [passwordConfirm, setEnteredPasswordConfirm] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');

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
    return msg.length == 0;
  }
  const verifyPassword = function() {
    const msg = controller.verifyPassword(password)
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
            navigation.replace('FinishAccount', {email: email});
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
          <FormControl isRequired isInvalid={emailErrorMessage.length > 0}>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input onChangeText={updateEmail}/>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
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
              onSubmitEditing={verifyPassword}
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
              onPress={() => navigation.replace('Login')}>
                I have an account
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>;
};
