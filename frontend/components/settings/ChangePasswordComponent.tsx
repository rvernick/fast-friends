import React, { useState } from "react";
import ChangePasswordController from "./ChangePasswordController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Button, Card, HelperText, TextInput, Surface } from "react-native-paper";
import { router } from "expo-router";
import { useSession } from "@/common/ctx";

export const ChangePasswordComponent = () => {
  const session = useSession();
  const appContext  = useGlobalContext();
  const controller = new ChangePasswordController(appContext);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setEnteredPassword] = useState('');
  const [passwordConfirm, setEnteredPasswordConfirm] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');  
  const [backLabel, setBackLabel] = useState('Cancel');

  const updateOldPassword = function(newText: string) {
    setOldPassword(newText);
    setPasswordErrorMessage('');
  }
  const updatePassword = function(newText: string) {
    setEnteredPassword(newText);
    setPasswordErrorMessage('');
    setPasswordConfirmErrorMessage('');
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
    console.log('change password');
    if(accountInfoValid()) {
      console.log('validated: ' + password);
      const response = controller.changePassword(session, oldPassword, password);
      response.then(msg => {
          console.log('create acct ' + msg);
          if (msg) {
            setPasswordErrorMessage(msg);
          } else {
            setBackLabel('Back to Settings');
            setPasswordConfirmErrorMessage('Password changed successfully');
            setOldPassword('');
            setEnteredPassword('');
            setEnteredPasswordConfirm('');
          }
        })
    } else {
      setPasswordConfirmErrorMessage('Invalid password or password confirmation');
    }
  };
  
  const backToSettings = function() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(home)/(settings)');
    }
  };

  return (
    <Surface>
      <Card>
        <Card.Content>      
          <TextInput
            label="Current Password"
            value={oldPassword}
            onChangeText={updateOldPassword}
            mode="outlined"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Current Password"
            accessibilityHint="Enter your current password"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={updatePassword}
            mode="outlined"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            testID="passwordInput"
            accessibilityLabel="New Password"
            accessibilityHint="Enter your new password"
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
            accessibilityLabel="Confirm Password"
            accessibilityHint="Re-enter your new password"
          />
          <HelperText type="error" visible={passwordErrorMessage.length > 0} style={{ marginTop: 10 }}>
            {passwordErrorMessage}
          </HelperText>
          <HelperText type="error" visible={passwordConfirmErrorMessage.length > 0} style={{ marginTop: 10 }}>
            {passwordConfirmErrorMessage}
          </HelperText>
          <Button 
            mode="contained" onPress={changePassword}
            disabled={passwordConfirmErrorMessage.length > 0 || passwordConfirmErrorMessage.length > 0}
            accessibilityLabel="Submit Password Change"
            accessibilityHint="Submits the new password for verification and changing">
            Update Password
          </Button>
          <HelperText type="error" visible={false}>
            {backLabel}
          </HelperText>
          <Button
            mode="contained"
            onPress={backToSettings}
            accessibilityLabel="Cancel Password Change"
            accessibilityHint="Cancel password change">
            {backLabel}
          </Button>
        </Card.Content>
      </Card>
    </Surface>
  ); 
};
