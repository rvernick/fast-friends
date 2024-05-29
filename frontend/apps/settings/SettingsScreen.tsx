import React, { useContext, useState } from "react";
import { Box, Heading, VStack, Button, Center, FormControl, Input, WarningOutlineIcon, HStack  } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import SettingsController from "./SettingsController";
import { isValidPhone } from '../common/utils';
import StravaController from "./StravaController";
import { useFocusEffect } from "@react-navigation/native";

export const SettingsScreen = ({ navigation, route }) => {
  const { appContext } = useContext(GlobalStateContext);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');
  const [userInvalid, setUserInvalid] = useState(false);

  const controller = new SettingsController(appContext);
  const stravaController = new StravaController(appContext);
  const email = appContext.getEmail();
  var user = appContext.getUser();

  const [firstName, setEnteredFirstName] = useState(user.firstName == null ? '' : user.firstName);
  const [lastName, setEnteredLastName] = useState(user.lastName == null ? '' : user.lastName);
  const [mobile, setEnteredMobile] = useState(user.cellPhone == null ? '' : user.cellPhone);
  const [stravaId, setStravaId] = useState(user.stravaId == null ? '' : user.stravaId);

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
      appContext.updateUser();
      if (msg) {
        setNameErrorMessage(msg);
      }
    })
  };

  const linkToStrava = async () => {
    await stravaController.linkToStrava(user);
    setUserInvalid(true);
  }

  const unlinkFromStrava = async () => {
    await stravaController.unlinkFromStrava(user);
    userUpdated();
  }

  const userUpdated = async () => {
    appContext.invalidateUser();
    user = await appContext.getUserPromise();
    console.log('user updated: ' + JSON.stringify(user));
    setStravaId(user.stravaId == null ? '' : user.stravaId);
    setEnteredFirstName(user.firstName == null ? '' : user.firstName);
    setEnteredLastName(user.lastName == null ? '' : user.lastName);
    setEnteredMobile(user.cellPhone == null ? '' : user.cellPhone);
  }

  useFocusEffect(() => {
    appContext.getUserPromise()
     .then((user) => {
      if (user.stravaId != null && stravaId.length == 0) {
        console.log('linked to strava and resetting');
        userUpdated();
        setUserInvalid(false);
      }});
    if (userInvalid) {
      userUpdated();
      setUserInvalid(false);
    }
  });

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
          <HStack mt="6" justifyContent="center">
            <Button onPress={ linkToStrava } mt="2" colorScheme="indigo" isDisabled={stravaId.length > 0}>
            {(stravaId.length > 0) ? ('Strava id: ' + stravaId) : 'Connect to Strava'}
            </Button>
            <Button onPress={ unlinkFromStrava } mt="2" colorScheme="red" isDisabled={stravaId.length == 0}>
              Unlink
            </Button>
          </HStack>
          <FormControl isReadOnly={true} isDisabled={true}>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input isReadOnly={true}
              type="text"
              placeholder={appContext.getEmail()}/>
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
