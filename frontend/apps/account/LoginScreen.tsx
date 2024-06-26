import React, { ChangeEvent, useContext, useState } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, WarningOutlineIcon, useTheme } from "native-base";
import { GestureResponderEvent, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import LoginController from "./LoginController";
import { GlobalStateContext } from "../config/GlobalContext";
import { login } from '../common/utils';
import { baseUrl } from "../common/http_utils";

export const LoginScreen = ({ navigation, loggedInMonitor }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new LoginController(appContext);
  var user = '';
  var pword = '';

  if (baseUrl() == 'http://localhost:3000') {
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

  const loginSubmit = function(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    e.preventDefault();
    attemptLogin();
  };

  const loginButton = function(e: GestureResponderEvent) {
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
          loggedInMonitor(false);
        } else {
          console.log('login successful');
          loggedInMonitor(true);
        }
      })
      .catch(error => {
        console.log('Failed to log in ' + error.message);
        setLoginErrorMessage(error.message);
      });
  };

  const theme = useTheme();
  const bgColor = theme.colors[50];
  return <Center w="100%" colorScheme={"primary"} >
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="primary.800" _dark={{
        color: "primary.50"
      }}>
          Fast Friends
        </Heading>
        <Heading mt="1" _dark={{
        color: "primary.200"
      }} color="primary.600" fontWeight="medium" size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isRequired>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input onChangeText={updateEmail}/>
          </FormControl>
          <FormControl isRequired isInvalid={loginErrorMessage.length > 0}>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              onChangeText={updatePassword}
              onSubmitEditing={loginSubmit}
              />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              { loginErrorMessage }
            </FormControl.ErrorMessage>
            <Link _text={{
              fontSize: "xs",
              fontWeight: "500",
              color: "primary.500"
            }} alignSelf="flex-end" mt="1" onPress={() => navigation.replace("ResetPassword")}>
              Forget Password?
            </Link>
          </FormControl>
          <Button disabled={!email.length || !password.length}
              variant={(!email.length || !password.length)? 'ghost' : 'solid'}
              onPress={loginButton} mt="2" colorScheme="indigo">
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Button
              variant={'ghost'}
              onPress={() => navigation.replace('CreateAccount')}>
                I'm a new user
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>;
};
