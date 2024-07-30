import React, { useContext, useState } from "react";
import ChangePasswordController from "./ChangePasswordController";
import { useGlobalContext } from "@/common/GlobalContext";
import { ThemedView } from "../ThemedView";
import { Button, HelperText, TextInput } from "react-native-paper";
import { router } from "expo-router";

export const ChangePasswordComponent = () => {
  const appContext  = useGlobalContext();
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
            router.back();
          }
        })
    }
  };
  
  return (
    <ThemedView>
      <TextInput
        label="Password"
        value={password}
        onChangeText={updatePassword}
        mode="outlined"
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
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
      <Button mode="contained" onPress={changePassword}>
        Update Password
      </Button>
    </ThemedView>
    ); 

    /** 
  <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          Fast Friends
        </Heading>
        <Heading mt="1" _dark={{
        color: "warmGray.200"
      }} color="coolGray.600" fontWeight="medium" size="xs">
          Change Password
        </Heading>

        <VStack space={3} mt="5">
        <FormControl
            isRequired
            isInvalid={passwordErrorMessage.length > 0} >
            <FormControl.Label>Old Password</FormControl.Label>
            <Input 
              type="password"
              onChangeText={updateOldPassword}
              />
          </FormControl>
          <FormControl
            isRequired
            isInvalid={passwordErrorMessage.length > 0} >
            <FormControl.Label>New Password</FormControl.Label>
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
          <Button onPress={ changePassword } mt="2" colorScheme="indigo">
            Update Password
          </Button>
        </VStack>
      </Box>
    </Center>;
    **/
};
