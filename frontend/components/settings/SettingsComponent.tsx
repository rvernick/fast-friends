import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { useGlobalContext } from "../../common/GlobalContext";
import SettingsController from "./SettingsController";
import { ensureString, forget, isMobile, isMobileSize, isValidPhone, strippedPhone } from '../../common/utils';
import StravaController from "./StravaController";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "@/common/ctx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser } from "../../common/utils";
import { BaseLayout } from "../layouts/base-layout";
import { Pressable } from "../ui/pressable";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { Button, ButtonText } from "../ui/button";
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";
import { Input, InputField } from "../ui/input";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "../ui/radio";
import { CircleIcon } from "../ui/icon";
import { HStack } from "../ui/hstack";

type SettingsProps = {
  strava_id: string;
};

export const SettingsComponent: React.FC<SettingsProps> = () => {
  const session = useSession();
  const { strava_id } = useLocalSearchParams();
  const [providedStravaId, setProvidedStravaId] = useState(ensureString(strava_id));

  const queryClient = useQueryClient();
  const email = session.email ? session.email : '';
  const appContext  = useGlobalContext();
  appContext.setSession(session);
  const [readOnly, setReadOnly] = useState(true);
  const [confirmUnlink, setConfirmUnlink] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');
  const [warnAgainstLinking, setWarnAgainstLinking] = useState(false);
  const [warnAgainstDeleting, setWarnAgainstDeleting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccessful, setSaveSuccessful] = useState(false);
  const [warnOnLosingData, setWarnOnLosingData] = useState(false);
  const controller = new SettingsController(appContext);
  const stravaController = new StravaController(appContext);

  const blankUser = {username: email,
    firstName: '',
    lastName: '',
    cellPhone: '',
    stravaId: providedStravaId,
    units: "miles",
    pushToken: '' };

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
    forget("ff.preferences");
    setIsDirty(false);
  }

  const [firstName, setEnteredFirstName] = useState(ensureString(data?.firstName));
  const [lastName, setEnteredLastName] = useState(ensureString(data?.lastName));
  const [cellPhone, setEnteredCellPhone] = useState(ensureString(data?.cellPhone));
  const [stravaId, setStravaId] = useState(providedStravaId);
  const [units, setUnits] = useState("miles");

  const updateFirstName = function(newText: string) {
    dirty();
    setEnteredFirstName(newText);
  }
  const updateLastName = function(newText: string) {
    dirty();
    setEnteredLastName(newText);
  }
  const updateMobile = function(newText: string) {
    dirty();
    if (newText.length == 0 || isValidPhone(newText)) {
      setMobileErrorMessage('');
    }
    setEnteredCellPhone(strippedPhone(newText));
  }

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
    return validatePhone();
  }

  const updateUnits = function(newUnits: string) {
    console.log('Updating units to: ' + newUnits);
    setUnits(newUnits);
    dirty();
  }

  const dirty = () => {
    setIsDirty(true);
  }

  const logout = () => {
    session.signOut();
    router.push('/');
  }

  const updateAccount = async function() {
    if (!validate()) {
      console.log('Not valid');
      return;
    }
    const response = await controller.updateAccount(session, email, firstName, lastName, cellPhone, ensureString(units));
    if (response === '') {
      setSaveSuccessful(true);
      setIsDirty(false);
      invalidateUser();
      setErrorMessage('');
    } else {
      setErrorMessage(response);
    }
  };

  const linkToStrava = async () => {
    if (isDirty) {
      if (validate()) {
        setWarnOnLosingData(true);
      }
    } else {
      doLinkToStrava();
    }
  }

  const doLinkToStrava = async () => {
    setErrorMessage('');
    const linking = await stravaController.linkToStrava(session);
    if (linking.length > 0) {
      setErrorMessage(linking);
    } else {
      setStravaId('Connecting to Strava...');
    }
    invalidateUser();
  }

  const cancelLinkToStrava = () => {
    setWarnOnLosingData(false);
  }

  const saveAndGoToStrava = async () => {
    setWarnOnLosingData(false);
    await updateAccount();
    doLinkToStrava();
  }

  const hideWarnAgainstLinking = () => {
    setWarnAgainstLinking(false);
  }

  const unlinkFromStrava = async () => {
    setConfirmUnlink(false);
    const msg = await stravaController.unlinkFromStrava(session, appContext, data);
    setProvidedStravaId('');
    setErrorMessage(msg);
    invalidateUser();
    userUpdated();
  }

  const cancel = () => {
    setIsDirty(false);
    setReadOnly(true);
    syncUser();
  }

  const userUpdated = async () => {
    if (isDirty) {
      return;
    }
    syncUser();
  }

  const syncUser = async () => {
    if (providedStravaId.length > 0) {
      setStravaId(providedStravaId);
    } else {
      const userStravaId = ensureString(data?.stravaId);
      setStravaId(userStravaId);
    }
    setEnteredFirstName(ensureString(data?.firstName));
    setEnteredLastName(ensureString(data?.lastName));
    setEnteredCellPhone(ensureString(data?.cellPhone));
    const newUnits = data?.units == "km" ? "km" : "miles";
    setUnits(newUnits);
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

  const deleteAccount = async () => {
    const msg = await controller.deleteAccount(session, email);
    invalidateUser();
    router.replace('/(home)/sign-out');
  }

  const UnlinkWarningComponent = () => {
   return (
      <AlertDialog isOpen={confirmUnlink}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <AlertDialogBody>
            <VStack>
              <Heading size="md" className="text-typography-950 font-semibold">
                Are you sure you want to unlink your Strava account?
              </Heading>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              className="bottom-button shadow-md rounded-lg m-1"
              variant="outline"
              action="secondary"
              onPress={() => setConfirmUnlink(false)}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                className="bottom-button shadow-md rounded-lg m-1"
                size="sm"
                onPress={unlinkFromStrava}>
                <ButtonText>Unlink</ButtonText>
            </Button>
              </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
   );
 }

 const DeleteAccountComponent = () => {
   return (
      <AlertDialog isOpen={warnAgainstDeleting}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <AlertDialogBody>
            <VStack>
              <Heading size="md" className="text-typography-950 font-semibold">
                Are you sure you want to detele your account?
              </Heading>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
                className="bottom-button shadow-md rounded-lg m-1"
                variant="outline"
                action="secondary"
                onPress={() => setWarnAgainstDeleting(false)}
                size="sm">
              <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                  className="bottom-button shadow-md rounded-lg m-1"
                  size="sm"
                  onPress={deleteAccount}>
                <ButtonText>Delete Account</ButtonText>
            </Button>
              </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
   );
 }

  useEffect(() => {
    try {
      userUpdated();
    } catch (error) {
      console.error('Error updating user', error);
    }
  }, [data, isFetching]);

  if (isFetching) return <Spinner size="large"/>;

  return (
    <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md">
        <VStack className="w-full">
          <Pressable disabled={stravaId.length > 0} onPress={linkToStrava}>
            <Image
              source={ require("../../assets/images/btn_strava_connectwith_orange.png")}
              style={{ width: 196, height: 48}}
              />
            <Text>{(stravaId.length > 0) ? ('Strava id: ' + stravaId) : ''}</Text>
          </Pressable>
          {readOnly || isDirty || stravaId.length == 0 ? null : (
            <Button
                className="bottom-button shadow-md rounded-lg m-1"
                onPress={() => setConfirmUnlink(true) }
                disabled={stravaId.length == 0}>
              <ButtonText>Unlink</ButtonText>
            </Button>)}
          <UnlinkWarningComponent />
          <Text>First Name</Text>
          <Input
            variant="outline"
            size="md"
            isReadOnly={readOnly}
            isDisabled={false}
            isInvalid={false}
          >
            <InputField
              value={firstName}
              onChangeText={updateFirstName}
              inputMode="numeric"
              testID="first-name"
              accessibilityLabel="First Name"
              accessibilityHint="First Name"/>
          </Input>

          <Text>Last Name</Text>
          <Input
            variant="outline"
            size="md"
            isReadOnly={readOnly}
            isDisabled={false}
            isInvalid={false}
          >
            <InputField
              value={lastName}
              onChangeText={updateLastName}
              inputMode="numeric"
              testID="last-name"
              accessibilityLabel="Last Name"
              accessibilityHint="Last Name"/>
          </Input>

          <Text>Mobile</Text>
          <Input
            variant="outline"
            size="md"
            isReadOnly={readOnly}
            isDisabled={false}
            isInvalid={false}
          >
            <InputField
              value={phoneFormat(cellPhone)}
              onChangeText={updateMobile}
              keyboardType="phone-pad"
              accessibilityLabel="Mobile number"
              accessibilityHint="Mobile number"/>
          </Input>
          <RadioGroup
              isDisabled={readOnly}
              value={units}
              onChange={updateUnits}
              testID="miles-km-selection">
            <Radio value="miles" testID="unit-miles">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>miles</RadioLabel>
            </Radio>
            <Radio value="km" testID="unit-km">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>km</RadioLabel>
            </Radio>
          </RadioGroup>
          <Button
            className="shadow-md rounded-lg m-1"
            style={{flex: 1}}
            onPress={ () => router.push('/(home)/(settings)/change-password') }
            accessibilityLabel="Change Password"
            accessibilityHint="Update the user password">
              <ButtonText>Change Password</ButtonText>
          </Button>
        </VStack>
        {readOnly ? null : (
          <Button
          className="shadow-md rounded-lg m-1"
          style={{flex: 1}}
          onPress={() => setWarnAgainstDeleting(true)}
          accessibilityLabel="Delete Account"
          accessibilityHint="Delete the user account">
            <ButtonText>Delete Account</ButtonText>
          </Button>)}
        <HStack>
          {readOnly ? (
            <Button
              className="bottom-button shadow-md rounded-lg m-1"
              style={{flex: 1}}
              onPress={() => setReadOnly(false)}
              testID="edit-button"
              accessibilityLabel="Edit Account"
              accessibilityHint="Edit the user account">
                <ButtonText>Edit</ButtonText>
            </Button>
          )
            : (<Button
              className="bottom-button shadow-md rounded-lg m-1"
              style={{flex: 1}}
              isDisabled={!isDirty}
              onPress={updateAccount}
              testID="update-button"
              accessibilityLabel="Update Account"
              accessibilityHint="Update the user account">
                <ButtonText>Update</ButtonText>
            </Button>)}
          <DeleteAccountComponent />
          {readOnly ? null : (
            <Button
              className="bottom-button shadow-md rounded-lg m-1"
              style={{flex: 1}}
              onPress={cancel}
              accessibilityLabel="Cancel edit"
              accessibilityHint="Cancel the edit">
                <ButtonText>Cancel</ButtonText>
            </Button>)}

        </HStack>
        {isMobileSize() ? (
          <Button
              className="bottom-button shadow-md rounded-lg m-1"
              style={{flex: 1}}
              onPress={logout}
              testID="logout-button"
              accessibilityLabel="Logout"
              accessibilityHint="Logout of the user account">
                <ButtonText>Logout</ButtonText>
            </Button>) : null }
      </VStack>
    </BaseLayout>
  )
};
