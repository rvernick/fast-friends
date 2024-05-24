import React, { useContext, useState } from "react";
import { Box, Heading, VStack, Button, Center, FormControl, Input, WarningOutlineIcon  } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import SettingsController from "./SettingsController";
import { isValidPhone } from '../common/utils';
import { StravaComponent } from './StravaComponent';
import StravaController from "./StravaController";

export const SettingsScreen = ({ navigation, route }) => {
  const { appContext } = useContext(GlobalStateContext);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');

  // const controller = new SettingsController(appContext);
  const stravaController = new StravaController(appContext);
  const email = appContext.getEmail();
  var user = appContext.getUser();

  const [firstName, setEnteredFirstName] = useState(user.firstName);
  const [lastName, setEnteredLastName] = useState(user.lastName);
  const [mobile, setEnteredMobile] = useState(user.mobile);
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
    // const response = controller.updateAccount(email, firstName, lastName, mobile);
    // response.then(msg => {
    //   console.log('setting names ' + firstName +'' + lastName +'' + msg);
    //   appContext.updateUser();
    //   if (msg) {
    //     setNameErrorMessage(msg);
    //   }
    // })
  };

  const linkToStrava = async () => {
    await stravaController.linkToStrava(user, appContext);
    appContext.invalidateUser();
    user = await appContext.getUserPromise();
    if (user.stravaId != null && user.stravaId != stravaId) {
      setStravaId(user.stravaId);
    }
  }

  console.log('checking strava id: ' + stravaId);

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
          <Button onPress={ linkToStrava } mt="2" colorScheme="indigo" isDisabled={stravaId.length > 0}>
          {(stravaId.length > 0) ? ('Strava id: ' + stravaId) : 'Connect to Strava'}
          </Button>
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

/*
useEffect(() => {
    console.log('SettingsScreen useEffect: ' + JSON.stringify(route));
  });


  const user = appContext.getUser();
    console.log('checking strava id: ' + user.stravaId + ' from ' + stravaId);

    if (user.stravaId != null && user.stravaId.length > 0) {
      if (user.stravaId != stravaId) {
        console.log('updating strava id to: ' + user.stravaId + ' from ' + stravaId);
        setStravaId(user.stravaId);
      }
    }


    <FormControl isReadOnly={true} isDisabled={stravaId.length > 0}>
            <FormControl.Label>Strava ID</FormControl.Label>
              <Input
                isReadOnly={true}
                type="text"
                placeholder={stravaId}/>
          </FormControl>
    */