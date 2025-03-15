import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useNavigation } from "expo-router";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, fetchUser, isMobile, metersToDisplayString } from "@/common/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Linking } from "react-native";
import { BaseLayout } from "../layouts/base-layout";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Input, InputField } from "../ui/input";
import { Alert, AlertIcon, AlertText } from "../ui/alert";
import { Button, ButtonText } from "../ui/button";
import { CheckIcon, InfoIcon } from "../ui/icon";
import { Dropdown } from "../common/Dropdown";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { HStack } from "../ui/hstack";

const groupsetBrands = [
  'Shimano',
  'SRAM',
  'Campagnolo',
  'Other',
]
const groupsetSpeeds = ['1', '9', '10', '11', '12', '13'];
const types = ['Road', 'Mountain', 'Hybrid', 'Cruiser', 'Electric', 'Cargo', 'Gravel'].sort();
const newBike = {
      id: 0,
      name: '',
      type: 'Road',
      groupsetBrand: 'Shimano',
      groupsetSpeed: 11,
      isElectronic: false,
      odometerMeters: 0,
      isRetired: false,
  }
type BikeProps = {
  bikeid: number
};

const BikeComponent: React.FC<BikeProps> = ({bikeid}) => {
  const session = useSession();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();

  const email = session.email ? session.email : '';

  var bikeId = bikeid ? bikeid : 0;

  const isNew = bikeId === 0;
  const [bikeName, setBikeName] = useState(newBike.name);
  const [readOnly, setReadOnly] = useState(!isNew);
  const [groupsetBrand, setGroupsetBrand] = useState(newBike.groupsetBrand);
  const [speed, setSpeeds] = useState(newBike.groupsetSpeed.toString());
  const [type, setType] = useState(newBike.type);
  const [isElectronic, setIsElectronic] = useState(newBike.isElectronic);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(isNew);
  const [stravaId, setStravaId] = useState('');
  const [milage, setMileage] = useState(newBike.odometerMeters.toFixed(0));
  const [milageLabel, setMileageLabel] = useState('Mileage');
  const [isRetired, setIsRetired] = useState(newBike.isRetired);
  const [connectedToStrava, setConnectedToStrava] = useState(false);

  const controller = new BikeController(appContext);
  const preferences = controller.getUserPreferences(session);

  const editOrDone = (value: any) => {
    if (!readOnly) {
      updateBike();
    } else {
      setReadOnly(false);
    }
  }

  const resetBike = async (bike: Bike) => {
    const pref = await preferences
    setMileageLabel('Mileage (' + pref.units + ')');
    console.log('reset bike: ' + JSON.stringify(bike));
    setBikeName(ensureString(bike.name));
    navigation.setOptions({ title: ensureString(bike.name) });
    setType(ensureString(bike.type));
    setGroupsetBrand(ensureString(bike.groupsetBrand));
    setSpeeds(ensureString(bike.groupsetSpeed));
    setIsElectronic(bike.isElectronic);
    setIsRetired(bike.isRetired);
    setMileage(metersToDisplayString(bike.odometerMeters, pref));
    setStravaId(ensureString(bike.stravaId));
    checkConnectedToStrava(bike.stravaId);
    setReadOnly(true);
  }

  const goBack = () => {  // maybe in AppController?
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(home)');
    }
  }

  const updateBike = async function() {
    const result = await controller.updateBike(session, email, bikeId,
      bikeName,
      displayStringToMeters(milage, await preferences),
      type,
      groupsetBrand,
      speed,
      isElectronic,
      isRetired);
    console.log('update bike result: ' + result);
    queryClient.invalidateQueries({ queryKey: ['bikes'] });
    if (result == '') {
      goBack();
    } else {
      setErrorMessage(result);
    }
  };

  const deleteBike = async function() {
    setErrorMessage('');
    const result = await controller.deleteBike(session, email, bikeId);
    queryClient.invalidateQueries({ queryKey: ['bikes'] });
    if (result == '') {
      goBack();
    } else {
      setErrorMessage(result);
    }
  }

  const cancel = () => {
    setIsInitialized(false);
    setReadOnly(true);
  }

  const maintenanceHistory = () => {
    router.replace({ pathname: '/(home)/(maintenanceHistory)/history', params: { bikeId: bikeId } });
  }

  const updateGroupsetBrand = (itemValue: string) => {
    setGroupsetBrand(itemValue);
  }

  const updateName = (name: string) => {
    setBikeName(name);
    navigation.setOptions({ title: name });
    setErrorMessage('');
  }

  useEffect(() => {
    if (!isInitialized) {
      controller.getBike(session, bikeId, email).then(bike => {
        if (bike != null) {
          resetBike(bike);
          setIsInitialized(true);
        }
      });
    }
  });

  const checkConnectedToStrava = (stravaId: string | null) => {
    setConnectedToStrava(
      stravaId !== null 
        && stravaId !== ''
        && stravaId!= '0');
  }

  const viewOnStrava = async () => {
    var idWithoutTheB = stravaId.replace('b', '');
    var bikeUri = 'strava://bikes/' + idWithoutTheB;
    var gearUri = 'strava://gear/';
    var url = `https://www.strava.com/bikes/${idWithoutTheB}`;

    if (isMobile() && await attemptToLinkToStravaApp()) {
      return;
    } 

    Linking.openURL(url).catch(err => console.error('Error opening strava link: ', err));
  }

  const attemptToLinkToStravaApp = async () => {
    var idWithoutTheB = stravaId.replace('b', '');
    var bikeUri = 'strava://bikes/' + idWithoutTheB;
    var gearUri = 'strava://gear/';

    const user = await fetchUser(session, ensureString(session.email));
    if (user && user.stravaId!= null && user.stravaId!= '') {
      gearUri = 'strava://athletes/' + user.stravaId + '/gear';
      if (await Linking.canOpenURL(gearUri)) {
        Linking.openURL(gearUri).catch(err => console.error('Error opening strava link: ', err));
        return true;
      } else {
        if (await Linking.canOpenURL(bikeUri)) {
          Linking.openURL(gearUri).catch(err => console.error('Error opening strava link: ', err));
          return true;
        }
      }
    }

    return false;
  }

  const groupsetOptions = groupsetBrands.map(brand => ({ label: brand, value: brand }));
  const speedOptions = groupsetSpeeds.map(speed => ({ label: speed, value: speed}));
  const typeOptions = types.map(type => ({ label: type, value: type }));

  return (
    <BaseLayout>
      <VStack className="max-w-[440px] w-full" space="md">
        <VStack className="w-full">
          <Text>Name</Text>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={readOnly}
          >
            <InputField 
              autoComplete="off"
              value={bikeName}
              readOnly={readOnly}
              onChangeText={updateName}
              placeholder="Enter bike name here..." 
              testID="nameInput"
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="name"
              accessibilityLabel="Name"
              accessibilityHint="The name of the bike being edited"/>
          </Input>
          {errorMessage.length > 0 ? (
            <Alert action="error" variant="outline">
              <AlertIcon as={InfoIcon} />
              <AlertText>{errorMessage}</AlertText>
            </Alert>)
            : <Text> </Text>}
          <Text>{milageLabel}</Text>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={readOnly || connectedToStrava}>
              <InputField 
                value={milage}
                onChangeText={(value) => setMileage(value ? value : '')}
                readOnly={readOnly || connectedToStrava}
                inputMode="numeric"
                testID="mileageField"
                accessibilityLabel="Milage"
                accessibilityHint="Mileage of the bike"/>
          </Input>
          <Text>Groupset</Text>
          <Dropdown
            disabled={readOnly}
            initialLabel="Choose a groupset"
            options={groupsetOptions}
            value={groupsetBrand}
            testID="groupsetDropdown"
            onSelect={(value) => setGroupsetBrand(value ? value : '')}
          />
          <Text>Type</Text>
          <Dropdown
            disabled={readOnly}
            options={typeOptions}
            value={type}
            testID="typeDropdown"
            onSelect={(value) => setType(value ? value : '')}
          />
          <Text>Speeds</Text>
          <Dropdown
            disabled={readOnly}
            options={speedOptions}
            value={speed}
            testID="speedsDropdown"
            onSelect={(value) => setSpeeds(value ? value : '')}
          />
          <Checkbox size="md"
              value="Is Electronic"
              isDisabled={readOnly}
              isChecked={isElectronic} 
              onChange={(newVal) => setIsElectronic(newVal)}
              accessibilityLabel="Has Electric Assist"> 
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>Electric</CheckboxLabel>
          </Checkbox>
          <Checkbox size="md"
              value="Is Retired"
              isDisabled={readOnly}
              isChecked={isRetired} 
              onChange={(newVal) => setIsRetired(newVal)}
              accessibilityLabel="Is Retired"> 
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>Retired</CheckboxLabel>
          </Checkbox>
        </VStack>
        <HStack>
          <Button 
            className="bottom-button shadow-md rounded-lg m-1"
            action="primary"
            onPress={ editOrDone }
            style={{flex: 1}} 
            accessibilityLabel="Finished editing"
            accessibilityHint="Will save any changes and go back">
            <ButtonText>{ readOnly? 'Edit' : 'Done' }</ButtonText>
          </Button>
          { (readOnly || isNew) ? null : <Button className="bottom-button shadow-md rounded-lg m-1" style={{flex: 1}} onPress={ cancel }>
            <ButtonText>Cancel</ButtonText> 
            </Button>}
          { (readOnly || isNew) ? null : <Button className="bottom-button shadow-md rounded-lg m-1" style={{flex: 1}} onPress={ deleteBike }> 
            <ButtonText>Delete</ButtonText>
            </Button>}
          { (readOnly && !isNew) ? <Button className="bottom-button shadow-md rounded-lg m-1" style={{flex: 1}} onPress={ maintenanceHistory }>
            <ButtonText>History</ButtonText>
            </Button> : null }
          {(connectedToStrava && readOnly &&!isNew ) ?
            <Button
              className="bottom-button shadow-md rounded-lg m-1"
              style={{flex: 1}}
              onPress={ viewOnStrava }
              accessibilityLabel="View on Strava"
              accessibilityHint="Open up the bike details on Strava">
                <ButtonText>On Strava</ButtonText>
            </Button> : null}
        </HStack>
      </VStack>
    </BaseLayout>
  );
};

export default BikeComponent;