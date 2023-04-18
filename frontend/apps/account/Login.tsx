import React, { ChangeEvent, useState } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { GestureResponderEvent, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import LoginController from "./LoginController";

let email = '';
let password = '';

export const Login = () => {
  const controller = new LoginController();
  const [email, setEnteredEmail] = useState('');
  const [password, setEnteredPassword] = useState('');

  const updateEmail = function(newText: string) {
    setEnteredEmail(newText);
  }

  const updatePassword = function(newText: string) {
    setEnteredPassword(newText);
  }

  const loginSubmit = function(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    e.preventDefault();
    controller.login(email, password);
  };

  const loginButton = function(e: GestureResponderEvent) {
    e.preventDefault();
    controller.login(email, password);
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
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isRequired>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input onChangeText={updateEmail}/>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Password</FormControl.Label>
            <Input 
              type="password"
              onChangeText={updatePassword}
              onSubmitEditing={loginSubmit}
              />
            <Link _text={{
            fontSize: "xs",
            fontWeight: "500",
            color: "indigo.500"
          }} alignSelf="flex-end" mt="1">
              Forget Password?
            </Link>
          </FormControl>
          <Button disabled={!email.length || !password.length} 
              variant={(!email.length || !password.length)? 'ghost' : 'solid'}
              onPress={loginButton} mt="2" colorScheme="indigo">
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
              I'm a new user.{" "}
            </Text>
            <Link _text={{
            color: "indigo.500",
            fontWeight: "medium",
            fontSize: "sm"
          }} href="#"> 
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>;
};
