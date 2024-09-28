import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../common/GlobalContext";
import SettingsController from "./SettingsController";
import { ensureString, isMobile, isValidPhone, strippedPhone } from '../../common/utils';
import StravaController from "./StravaController";
import { ActivityIndicator, Button, Card, Dialog, HelperText, Portal, Surface, Text, TextInput } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "@/ctx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser } from "../../common/utils";
import { ScrollView, StyleSheet } from "react-native";
import { styles } from "@/common/styles";

type SettingsProps = {
  strava_id: string;
};

export const SettingsComponent: React.FC<SettingsProps> = () => {
  const session = useSession();
  const { strava_id } = useLocalSearchParams();
  const [providedStravaId, setProvidedStravaId] = useState(ensureString(strava_id));

  console.log('SettingsComponent strava_id: '+ strava_id);
  const queryClient = useQueryClient();
  const email = session.email ? session.email : '';
  const appContext  = useGlobalContext();
  appContext.setSession(session);
  const [errorMessage, setErrorMessage] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');
  const [warnAgainstLinking, setWarnAgainstLinking] = useState(false);

  const controller = new SettingsController(appContext);
  const stravaController = new StravaController(appContext);
  
  const blankUser = {username: email, firstName: '', lastName: '', cellPhone: '', stravaId: providedStravaId};
  const { status, data, error, isFetching } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser(session, email),
    initialData: blankUser,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  });

  const invalidateUser = () => {
    console.log('Invalidate user: ' + email);
    queryClient.removeQueries({queryKey: ['user']});
    queryClient.removeQueries({ queryKey: ['bikes'] });
  }
  
  const [firstName, setEnteredFirstName] = useState(ensureString(data?.firstName));
  const [lastName, setEnteredLastName] = useState(ensureString(data?.lastName));
  const [cellPhone, setEnteredCellPhone] = useState(ensureString(data?.cellPhone));
  const [stravaId, setStravaId] = useState(providedStravaId);

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
    setEnteredCellPhone(strippedPhone(newText));
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
    console.log('validating: ' + cellPhone);
    if (cellPhone.length == 0 || isValidPhone(cellPhone)) {
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
    // console.log('name/cellPhone error:' + nameErrorMessage + mobileErrorMessage);
    return result;
  }

  const updateAccount = function() {
    if (!validate()) {
      console.log('Not valid');
      return;
    }
    const response = controller.updateAccount(session, email, firstName, lastName, cellPhone);
    invalidateUser();
  };

  const linkToStrava = async () => {
    if (isMobile()) {
      setWarnAgainstLinking(true);
    } else {
      await stravaController.linkToStrava(session);
      setStravaId('Connecting to Strava...');
      invalidateUser();
    }
  }

  const hideWarnAgainstLinking = () => {
    setWarnAgainstLinking(false);
  }
  
  const unlinkFromStrava = async () => {
    const msg = await stravaController.unlinkFromStrava(session, appContext, data);
    setProvidedStravaId('');
    setErrorMessage(msg);
    invalidateUser();
    userUpdated();
  }

  const userUpdated = async () => {
    if (providedStravaId.length > 0) {
      setStravaId(providedStravaId);
    } else {
      const userStravaId = ensureString(data?.stravaId);
      setStravaId(userStravaId);
    }
    setEnteredFirstName(ensureString(data?.firstName));
    setEnteredLastName(ensureString(data?.lastName));
    setEnteredCellPhone(ensureString(data?.cellPhone));
  }

  const phoneFormat = (phoneWithEverything: string) => {
    const phone = strippedPhone(phoneWithEverything);
    if (phone.length == 0) {
      return '';
    }
    if (phone.length < 4) {
      return "(" + phone;
    }
    if (phone.length <= 6) {
      return '(' + phone.slice(0, 3) + ') '+ phone.slice(3);
    }
    if (phone.length <= 10) {
      return '(' + phone.slice(0, 3) + ') '+ phone.slice(3, 6) + '-' + phone.slice(6);
    }
    return phone;
  }

  useEffect(() => {
    try {
      userUpdated();
    } catch (error) {
      console.error('Error updating user', error);
    }
  }, [data, isFetching]);

  if (isFetching) return <ActivityIndicator />;
  return (
    <Surface >
      {/* <ScrollView style={styles.container}> */}
        <Card>
          <Card.Title title={firstName + ': ' + email} />
          <Card.Content>

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
          value={phoneFormat(cellPhone)}
          onChangeText={updateMobile}
          mode="outlined"
          keyboardType="phone-pad"
        />
        <HelperText type="error" visible={mobileErrorMessage.length > 0} style={{ marginTop: 10 }}>
          {mobileErrorMessage}
        </HelperText>
        <HelperText type="error" visible={errorMessage.length > 0} style={{ marginTop: 10 }}>
          {errorMessage}
        </HelperText>
        <Card>
          <Card.Content>
            <Button onPress={ linkToStrava } disabled={stravaId.length > 0}>
                {(stravaId.length > 0) ? ('Strava id: ' + stravaId) : 'Connect to Strava'}
              </Button>
              <Button mode="contained-tonal" onPress={ unlinkFromStrava } disabled={stravaId.length == 0}>
                Unlink
              </Button>
              <Portal>
                <Dialog visible={warnAgainstLinking} onDismiss={hideWarnAgainstLinking}>
                  <Dialog.Title>Alert</Dialog.Title>
                  <Dialog.Content>
                    <Text variant="bodyMedium">Log in through browser to link with Strava https://www.fastfriends.biz</Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={hideWarnAgainstLinking}>Done</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal> 
          </Card.Content>
        </Card>
        <HelperText type="error"> </HelperText>
        <Button mode="contained" onPress={ updateAccount } disabled={mobileErrorMessage.length > 0 || nameErrorMessage.length > 0}>
              Update Account
            </Button>
            <HelperText type="error"> </HelperText>
          <Button mode="contained" onPress={ () => router.push('change-password') }>
              Change Password
            </Button>
          </Card.Content>
        </Card>
      {/* </ScrollView> */}
    </Surface>
  )
};
