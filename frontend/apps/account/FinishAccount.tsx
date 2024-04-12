import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import FinishAccountController from './FinishAccountController';

export function FinishAccount({ navigation, route }) {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new FinishAccountController(appContext);
  const [firstName, setEnteredFirstName] = useState('');
  const [lastName, setEnteredLastName] = useState('');
  const [mobile, setEnteredMobile] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');

  const email = route.params.email;

  const updateFirstName = function(newText: string) {
    setEnteredFirstName(newText);
  }
  const updateLastName = function(newText: string) {
    setEnteredLastName(newText);
  }
  const updateMobile = function(newText: string) {
    setEnteredMobile(newText);
  }

  const validatePhone = () => {
    // Simple phone number validation
    var mobileEntered = mobile.replace(/[^0-9]/g, '');
    console.log(mobileEntered);
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobileEntered)) {
      setMobileErrorMessage('Invalid phone number');
    } else {
      setMobileErrorMessage('');
    }
  };

  const updateAccount = function() {
    navigation.replace('Login');
    const response = controller.updateAccount(email, firstName, lastName, null);
    response.then(msg => {
      console.log('setting names ' + firstName +'' + lastName +'' + msg);
        if (msg) {
          setNameErrorMessage(msg);
        } else {
          navigation.replace('Login');
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
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Last Name</FormControl.Label>
            <Input
              type="text"
              onChangeText={updateLastName}/>
          </FormControl>
          <FormControl >
            <FormControl.Label>Mobile</FormControl.Label>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                { mobileErrorMessage }
              </FormControl.ErrorMessage>
            <Input
              type="text"
              keyboardType="phone-pad"
              onChangeText={updateMobile}
              onBlur={validatePhone}/>
          </FormControl>
          <Button onPress={ updateAccount } mt="2" colorScheme="indigo">
            Update Account
          </Button>
          <HStack mt="6" justifyContent="center">
          </HStack>
        </VStack>
      </Box>
    </Center>;
};
