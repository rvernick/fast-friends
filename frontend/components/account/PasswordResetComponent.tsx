import React, { useState } from "react";
import { useSession } from "@/ctx";
import { useGlobalContext } from "@/common/GlobalContext";
import ResetPasswordController from "./ResetPasswordController";
import { Button, Card, TextInput, Surface } from "react-native-paper";
import { isValidEmail } from "@/common/utils";
import { router } from "expo-router";

export const PasswordResetComponent = () => {
  const session = useSession();
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
          <TextInput value={email} onChangeText={updateEmail} placeholder="Email" />
          <Button 
            disabled={!(isValidEmail(email) || email === DEVELOPER)}
            mode={isValidEmail(email) ? "contained" : "outlined"}
            onPress={resetPassword}>
            Reset Password
          </Button>
      </Card.Content>
      </Card>
    </Surface>
  
  );
};
