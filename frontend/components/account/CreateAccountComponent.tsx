import React, { useContext, useState } from "react";
import { invalidPasswordMessage, isMobile, isValidEmail, isValidPassword } from '../../common/utils';
import { router } from "expo-router";
import CreateAccountController from "./CreateAccountController";
import { Dimensions } from "react-native";
import { createStyles, defaultWebStyles } from "@/common/styles";
import { BaseLayout } from "../layouts/base-layout";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Heading } from "../ui/heading";
import { Input, InputField } from "../ui/input";
import { Button, ButtonText } from "../ui/button";
import { Alert, AlertIcon, AlertText } from "../ui/alert";
import { InfoIcon } from "../ui/icon";
import { Link, LinkText } from "../ui/link";

interface CreateAccountComponentProps {
  controller: CreateAccountController;
}

export const CreateAccountComponent: React.FC<CreateAccountComponentProps> = ({ controller }) => {
  const [email, setEnteredEmail] = useState('');
  const [password, setEnteredPassword] = useState('');
  const [passwordConfirm, setEnteredPasswordConfirm] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles;

  const updateEmail = function(newText: string) {
    setEnteredEmail(newText);
    setEmailErrorMessage('');
  }
  const updatePassword = function(newText: string) {
    setEnteredPassword(newText);
    setPasswordErrorMessage('');
  }
  const updatePasswordConfirm = function(newText: string) {
    setEnteredPasswordConfirm(newText);
    setPasswordConfirmErrorMessage('');
  }

  const verifyEmail = function() {
    if (isValidEmail(email)) {
      setEmailErrorMessage('');
      return true;
    } else {
      setEmailErrorMessage('Please enter valid email');
      return false;
    }
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
    return verifyEmail()
      && verifyPassword()
      && verifyPasswordMatch();
  };

  const apply = async function() {
    if (!accountInfoValid()) {
      return;
    }
    const msg = await controller.apply(email, password);
    if (msg) {
      setEmailErrorMessage(msg);
    } else {
      router.replace('/sign-in');
    }
  };

  return (
    <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md">
        <VStack className="md:items-center" space="md">
          <VStack>
            <Heading className="text-center" size="3xl">
              New Account
            </Heading>
            <Text className="text-center">Pedal Assistant, the Strava powered maintenance tracker</Text>
            <Text className="text-center">You think about your rides</Text>
            <Text className="text-center">We'll think about your bike needs so you don't have to</Text>
            <Text> </Text>

          </VStack>
        </VStack>
        <VStack className="w-full">
          <VStack space="md" className="w-full"></VStack>
            <Text>Email</Text>
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField 
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={updateEmail}
                onBlur={verifyEmail}
                placeholder="Enter email here..." 
                testID="emailInput"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                accessibilityLabel="email"
                accessibilityHint="The email address of the user being created"/>
            </Input>
            {emailErrorMessage.length > 0 ? (
              <Alert action="error" variant="outline">
                <AlertIcon as={InfoIcon} />
                <AlertText>{emailErrorMessage}</AlertText>
              </Alert>)
             : <Text> </Text>}
             
             <Text>Password</Text>
             <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField 
                  value={password}
                  onChangeText={updatePassword}
                  inputMode="text"
                  textContentType="password"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onBlur={verifyPassword}
                  testID="passwordInput"
                  accessibilityLabel="password"
                  accessibilityHint="A password of at least 8 characters with a mix of special, upper and lower case'"
                  autoComplete="password"
                  placeholder="Enter password here..."/>
              </Input>
            {passwordErrorMessage.length > 0 ? (
              <Alert action="error" variant="outline">
                <AlertIcon as={InfoIcon} />
                <AlertText>{passwordErrorMessage}</AlertText>
              </Alert>)
            : <Text> </Text>}
            <Text>Confirm Password</Text>
             <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField
                value={passwordConfirm}
                onChangeText={updatePasswordConfirm}
                inputMode="text"
                textContentType="password"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                testID="passwordConfirmInput"
                accessibilityLabel="password confirm"
                accessibilityHint="Re-enter the password to confirm it"
                autoComplete="email"
                placeholder="Confirm password..."/>
            </Input>
            {passwordConfirmErrorMessage.length > 0 ? (
              <Alert action="error" variant="outline">
                <AlertIcon as={InfoIcon} />
                <AlertText>{passwordConfirmErrorMessage}</AlertText>
              </Alert>)
             : <Text> </Text>}
            <Button size="md" variant="solid"
                className="bottom-button shadow-md rounded-lg m-1"
                action="primary" 
                onPress={apply}
                disabled={emailErrorMessage.length > 0 || passwordConfirmErrorMessage.length > 0 || passwordErrorMessage.length > 0}
                testID="submitButton"
                accessibilityLabel="Sign Up Button"
                accessibilityHint="The button to submit the info to create the new account">
              <ButtonText>Sign Up</ButtonText>
            </Button>
        </VStack>
        <Link onPress={() => router.push("/(sign-in-sign-up)/(sign-in)/sign-in")}>
          <LinkText className="font-medium text-sm text-primary-700 group-hover/link:text-primary-600">
            I have an account
          </LinkText>
      </Link>
      </VStack>
    </BaseLayout>
  );
};
