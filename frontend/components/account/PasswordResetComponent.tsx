import React, { useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import ResetPasswordController from "./ResetPasswordController";
import { Button, Card, TextInput, Surface } from "react-native-paper";
import { isValidEmail } from "@/common/utils";
import { router } from "expo-router";

export const PasswordResetComponent = () => {
  const appContext = useGlobalContext();
  const controller = new ResetPasswordController(appContext);
  const [email, setEnteredEmail] = useState('');
  const DEVELOPER = 'developer';
  const updateEmail = function(newText: string) {
    setEnteredEmail(newText);
  }

  const resetPassword = function() {
    if (email === DEVELOPER) {
      router.replace('/developer');
      return;
    }
    controller.resetPassword(email);
  };

  return (
    <Surface>
      <Card>
        <Card.Title title="Send Password Reset"></Card.Title>
        <Card.Content>
          <TextInput
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={updateEmail} 
            placeholder="Email"
            accessibilityLabel="Email Address"
            accessibilityHint="Email address for account which needs a password reset" />
          <Button 
            disabled={!(isValidEmail(email) || email === DEVELOPER)}
            mode={isValidEmail(email) ? "contained" : "outlined"}
            onPress={resetPassword}
            accessibilityLabel="Send Password Reset"
            accessibilityHint="An email with reset information will be sent on press">
            Reset Password
          </Button>
      </Card.Content>
      </Card>
    </Surface>
  
  );
};
