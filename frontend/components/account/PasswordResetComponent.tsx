import React, { useState } from "react";
import { useSession } from "@/ctx";
import { useGlobalContext } from "@/common/GlobalContext";
import ResetPasswordController from "./ResetPasswordController";
import { ThemedView } from "../ThemedView";
import { Button, Card, TextInput } from "react-native-paper";
import { isValidEmail } from "@/common/utils";

export const PasswordResetComponent = () => {
  const session = useSession();
  const appContext = useGlobalContext();
  const controller = new ResetPasswordController(appContext);
  const [email, setEnteredEmail] = useState('');

  const updateEmail = function(newText: string) {
    setEnteredEmail(newText);
  }

  const resetPassword = function() {
    controller.resetPassword(email);
  };

  return (
    <ThemedView>
      <Card>
        <Card.Title title="New Account"></Card.Title>
        <Card.Content>
          <TextInput value={email} onChangeText={updateEmail} placeholder="Email" />
          <Button 
            disabled={!isValidEmail(email)}
            mode={isValidEmail(email) ? "contained" : "outlined"}
            onPress={resetPassword}>
            Reset Password
          </Button>
      </Card.Content>
      </Card>
    </ThemedView>
  
  );
};
