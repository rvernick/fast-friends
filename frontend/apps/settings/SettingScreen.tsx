import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import ChangePasswordController from "./ChangePasswordController";

export const SettingScreen = ({ navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new ChangePasswordController(appContext);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setEnteredPassword] = useState('');
  const [passwordConfirm, setEnteredPasswordConfirm] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');  
  
  const updateOldPassword = function(newText: string) {
    setOldPassword(newText);
  }
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

  const changePassword = function() {
    if(accountInfoValid()) {
      const response = controller.changePassword(oldPassword, password);
      response.then(msg => {
          console.log('create acct ' + msg);
          if (msg) {
            setPasswordErrorMessage(msg);
          } else {
            navigation.replace('Settings');
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
          Settings
        </Heading>

        <VStack space={3} mt="5">
        <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Input isReadOnly={true}>
              {appContext.email}
            </Input>
          </FormControl>
          <Button onPress={ () => navigation.push('ChangePassword') } mt="2" colorScheme="indigo">
            Update Password
          </Button>
        </VStack>
      </Box>
    </Center>;
};
