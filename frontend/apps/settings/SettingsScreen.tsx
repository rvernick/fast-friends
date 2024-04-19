import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import SettingsController from "./SettingsController";
import { isValidPhone } from '../common/utils';
import { useQuery, useQueryClient } from'@tanstack/react-query';

export const SettingsScreen = ({ navigation, route }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new SettingsController(appContext);
  const email = appContext.email;
  const user = route.params.user;

  const [firstName, setEnteredFirstName] = useState(user ? user.firstName : '');
  const [lastName, setEnteredLastName] = useState(user ? user.lastName : '');
  const [mobile, setEnteredMobile] = useState(user ? user.cellPhone : '');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');

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
          Settings
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isReadOnly={true} isDisabled={true}>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input isReadOnly={true}
              type="text"
              placeholder={appContext.email}/>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>First Name</FormControl.Label>
            <Input
              type="text"
              value={firstName}
              onChangeText={updateFirstName}/>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              { nameErrorMessage }
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Last Name</FormControl.Label>
            <Input
              type="text"
              value={lastName}
              onChangeText={updateLastName}/>
          </FormControl>
          <FormControl isInvalid={mobileErrorMessage.length > 0} >
            <FormControl.Label>Mobile</FormControl.Label>
            <Input
              type="text"
              value={mobile}
              onChangeText={updateMobile}
              />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                { mobileErrorMessage }
            </FormControl.ErrorMessage>
          </FormControl>
          <Button onPress={ updateAccount } isDisabled={mobileErrorMessage.length > 0} mt="2" colorScheme="indigo">
            Update Account
          </Button>
         <Button onPress={ () => navigation.push('ChangePassword') } mt="2" colorScheme="indigo">
            Update Password
          </Button>
        </VStack>
      </Box>
    </Center>;
};
