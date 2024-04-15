import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import FinishAccountController from './FinishAccountController';
import { strippedPhone, isValidPhone } from './utils';

export function FinishAccount({ navigation, route }) {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new FinishAccountController(appContext);
  const [firstName, setEnteredFirstName] = useState('');
  const [lastName, setEnteredLastName] = useState('');
  const [mobile, setEnteredMobile] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');

  const email = appContext.email;

  const updateFirstName = function(newText: string) {
    setEnteredFirstName(newText);
  }
  const updateLastName = function(newText: string) {
    setEnteredLastName(newText);
  }
  const updateMobile = function(newText: string) {
    if (isValidPhone(newText)) {
      setMobileErrorMessage('');
    }
    setEnteredMobile(newText);
  }

  const validatePhone = () => {
    // Simple phone number validation
    console.log('validating: ' + mobile);
    if (mobile.length == 0 || isValidPhone(mobile)) {
      setMobileErrorMessage('');
    } else {
      console.log('Invalid phone number');
      setMobileErrorMessage('Invalid phone number');
    }
  };

  const updateAccount = function() {
    const response = controller.updateAccount(email, firstName, lastName, mobile);
    response.then(msg => {
      console.log('setting names ' + firstName +'' + lastName +'' + msg);
        if (msg) {
          setNameErrorMessage(msg);
        } else {
          navigation.replace('Home');
        }
      })
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
          Create Account
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isRequired>
            <FormControl.Label>First Name</FormControl.Label>
            <Input
              type="text"
              onChangeText={updateFirstName}/>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              { nameErrorMessage }
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Last Name</FormControl.Label>
            <Input
              type="text"
              onChangeText={updateLastName}/>
          </FormControl>
          <FormControl isInvalid={mobileErrorMessage.length > 0} >
            <FormControl.Label>Mobile</FormControl.Label>
            <Input
              type="text"
              keyboardType="phone-pad"
              onChangeText={updateMobile}
              onBlur={validatePhone}/>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                { mobileErrorMessage }
            </FormControl.ErrorMessage>
          </FormControl>
          <Button onPress={ updateAccount } isDisabled={mobileErrorMessage.length > 0} mt="2" colorScheme="indigo">
            Update Account
          </Button>
          <HStack mt="6" justifyContent="center">
          </HStack>
        </VStack>
      </Box>
    </Center>;
};
