import React, { useState } from "react";
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
};