import React, { useState } from "react";
import { invalidPasswordMessage, isValidPassword } from '../../common/utils';
import { ThemedView } from "../ThemedView";
import { Button, TextInput, HelperText, Text } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { post } from "@/common/http-utils";


interface NewPasswordOnResetProps {
  token: string;
}

export const NewPasswordOnResetComponent: React.FC<NewPasswordOnResetProps> = () => {
  const { token } = useLocalSearchParams();
  const [password, setEnteredPassword] = useState('');
  const [passwordConfirm, setEnteredPasswordConfirm] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');

  const updatePassword = function(newText: string) {
    setEnteredPassword(newText);
    setPasswordErrorMessage('');
  }
  const updatePasswordConfirm = function(newText: string) {
    setEnteredPasswordConfirm(newText);
    setPasswordConfirmErrorMessage('');
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
    return verifyPassword()
      && verifyPasswordMatch();
  };

  const callResetPassword = async function() {
     if (!accountInfoValid()) {
      return;
    }
    try {
      const body = {
        token: token,
        password: password,
      };

      const response = await post('/auth/reset-password', body, null);
      if (response.ok) {
        router.replace('/sign-in');
      } else {
        const result = await response.json();
        console.log('json'+ result.message);
        setPasswordConfirmErrorMessage(result.message);
      }
    } catch(e: any) {
      console.log(e.message);
      setPasswordConfirmErrorMessage('Unable to Reset Password');
    }
  }

  return (
    <ThemedView>
      <Text> {token} </Text>
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
      <HelperText type="error" visible={passwordErrorMessage.length > 0} style={{ marginTop: 10 }}>
        {passwordErrorMessage}
      </HelperText>
      <TextInput
        label="Confirm Password"
        value={passwordConfirm}
        mode="outlined"
        onChangeText={updatePasswordConfirm}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <HelperText type="error" visible={passwordConfirmErrorMessage.length > 0} style={{ marginTop: 10 }}>
        {passwordConfirmErrorMessage}
      </HelperText>
      <Button mode="contained" onPress={callResetPassword}>
        Set Password
      </Button>
    </ThemedView>
    );
};
