import React, { useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import ResetPasswordController from "./ResetPasswordController";
import { isValidEmail } from "@/common/utils";
import { router } from "expo-router";
import { BaseLayout } from "../layouts/base-layout";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Input, InputField } from "../ui/input";
import { Button, ButtonText } from "../ui/button";

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
    <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md">
        <VStack className="md:items-center" space="md">
          <VStack>
            <Heading className="md:text-center" size="3xl">
              Password Reset
            </Heading>
            <Text>Email address for account which needs a password reset</Text>
          </VStack>
        </VStack>
        <VStack className="w-full">
          <VStack space="md" className="w-full"></VStack>
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField 
                autoComplete="email"
                keyboardType="email-address"value={email}
                onChangeText={updateEmail}
                placeholder="Enter email here..." 
                testID="emailInput"
                accessibilityLabel="Email Address"
                accessibilityHint="Email address for account which needs a password reset"/>
            </Input>
            <Button size="md" variant="solid"
                action="primary" 
                onPress={resetPassword}
                disabled={!(isValidEmail(email) || email === DEVELOPER)}
                testID="submitButton"
                accessibilityLabel="Send Password Reset"
                accessibilityHint="An email with reset information will be sent on press">
              <ButtonText>Reset Password</ButtonText>
            </Button>
        </VStack>
      </VStack>
    </BaseLayout>
  )
};
