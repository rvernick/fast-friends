import React, { useState } from "react";
import { useGlobalContext } from "../../common/GlobalContext";
import SettingsController from "./SettingsController";
import { isValidPhone } from '../../common/utils';
import StravaController from "./StravaController";
import { ThemedView } from "../ThemedView";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { router } from "expo-router";
import { useSession } from "@/ctx";

export const SettingsComponent = () => {
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext  = useGlobalContext();
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');
  const [userInvalid, setUserInvalid] = useState(false);

  const controller = new SettingsController(appContext);
  const stravaController = new StravaController(appContext);
  
  const blankUser = {username: email, firstName: '', lastName: '', mobile: '', stravaId: ''};
  var user = appContext.getUser();
  if (user == null) {
    user = blankUser
  }
  const [firstName, setEnteredFirstName] = useState(user.firstName);
  const [lastName, setEnteredLastName] = useState(user?.lastName);
  const [mobile, setEnteredMobile] = useState(user.mobile);
  const [stravaId, setStravaId] = useState(user.stravaId);

  const updateFirstName = function(newText: string) {
    setNameErrorMessage('');
    setEnteredFirstName(newText);
  }
  const updateLastName = function(newText: string) {
    setNameErrorMessage('');
    setEnteredLastName(newText);
  }
  const updateMobile = function(newText: string) {
    if (newText.length == 0 || isValidPhone(newText)) {
      setMobileErrorMessage('');
    }
    setEnteredMobile(newText);
  }

  const validateName = () => {
    if (firstName.length == 0 || lastName.length == 0) {
      setNameErrorMessage('First name and last name are required');
      return false;
    } else {
      setNameErrorMessage('');
    }
    console.log('Name :'+ firstName +' ' + lastName);
    return true;
  };

  const validatePhone = () => {
    // Simple phone number validation
    console.log('validating: ' + mobile);
    if (mobile.length == 0 || isValidPhone(mobile)) {
      setMobileErrorMessage('');
      return true;
    } else {
      console.log('Invalid phone number');
      setMobileErrorMessage('Invalid phone number');
      return false;
    }
  };

  const validate = () => {
    var result = true;
    result = result && validateName();
    result = result && validatePhone();
    // console.log('name/mobile error:' + nameErrorMessage + mobileErrorMessage);
    return result;
  }

  const updateAccount = function() {
    if (!validate()) {
      console.log('Not valid');
      return;
    }
    const response = controller.updateAccount(session, email, firstName, lastName, mobile);
    response.then(msg => {
      console.log('setting names ' + firstName +'' + lastName +'' + msg);
      appContext.updateUser();
      if (msg) {
        setMobileErrorMessage(msg);
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
    var user = await appContext.getUserPromise();
    if (user == null) {
      user = blankUser;
    }
    console.log('user updated: ' + JSON.stringify(user));
    setStravaId(user.stravaId == null ? '' : user.stravaId);
    setEnteredFirstName(user.firstName == null ? '' : user.firstName);
    setEnteredLastName(user.lastName == null ? '' : user.lastName);
    setEnteredMobile(user.mobile == null ? '' : user.mobile);
  }

  // useFocusEffect(() => {
  //   appContext.getUserPromise()
  //    .then((user) => {
  //     if (user == null) {
  //       user = blankUser;
  //     }
  //     if (user.stravaId != null && stravaId.length == 0) {
  //       console.log('linked to strava and resetting');
  //       userUpdated();
  //       setUserInvalid(false);
  //     }});
  //   if (userInvalid) {
  //     userUpdated();
  //     setUserInvalid(false);
  //   }
  // });

  return (
    <ThemedView>
      <Button onPress={ linkToStrava } disabled={stravaId.length > 0}>
        {(stravaId.length > 0) ? ('Strava id: ' + stravaId) : 'Connect to Strava'}
      </Button>
      <Button onPress={ unlinkFromStrava } disabled={stravaId.length == 0}>
        Unlink
      </Button>
      <Text variant="headlineSmall">Email: {appContext.getEmail()}</Text>
      <TextInput label="First Name"
        value={firstName}
        onChangeText={updateFirstName}
        mode="outlined"
        autoCapitalize="words"
        autoCorrect={false}
      />
      <TextInput label="Last Name"
        value={lastName}
        onChangeText={updateLastName}
        mode="outlined"
        autoCapitalize="words"
        autoCorrect={false}
      />
      <HelperText type="error" visible={nameErrorMessage.length > 0} style={{ marginTop: 10 }}>
        {nameErrorMessage}
      </HelperText>
      <TextInput label="Mobile"
        value={mobile}
        onChangeText={updateMobile}
        mode="outlined"
        keyboardType="phone-pad"
      />
      <HelperText type="error" visible={mobileErrorMessage.length > 0} style={{ marginTop: 10 }}>
        {mobileErrorMessage}
      </HelperText>
      <Button onPress={ updateAccount } disabled={mobileErrorMessage.length > 0 || nameErrorMessage.length > 0}>
            Update Account
          </Button>
         <Button onPress={ () => router.push('change-password') }>
            Update Password
          </Button>
    </ThemedView>
  )
};
