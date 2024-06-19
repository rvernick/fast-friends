import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center } from "native-base";
import { GestureResponderEvent, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { GlobalStateContext } from "../config/GlobalContext";
import ResetPasswordController from "./ResetPasswordController";
import { isValidEmail } from "../common/utils";

export const PasswordReset = ({ navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new ResetPasswordController(appContext, navigation);
  const [email, setEnteredEmail] = useState('');

  const updateEmail = function(newText: string) {
    setEnteredEmail(newText);
  }

  const resetPassword = function(e) {
    e.preventDefault();
    controller.resetPassword(email);
  };

  const loginButton = function(e: GestureResponderEvent) {
    e.preventDefault();
    controller.resetPassword(email);
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
          Reset Password
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isRequired>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input onChangeText={updateEmail}/>
          </FormControl>
          <Button disabled={!isValidEmail(email)}
              variant={(isValidEmail(email))? 'solid' : 'ghost'}
              onPress={resetPassword} mt="2" colorScheme="indigo">
            Reset Password
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
