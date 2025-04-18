import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useNavigation } from "expo-router";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, metersToDisplayString } from "@/common/utils";
import { useQueryClient } from "@tanstack/react-query";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Input, InputField } from "../ui/input";
import { Alert, AlertIcon, AlertText } from "../ui/alert";
import { CheckIcon, InfoIcon } from "../ui/icon";
import { Dropdown } from "../common/Dropdown";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../ui/checkbox";
import { BrandAutocompleteDropdown } from "../common/BrandAutocompleteDropdown";
import { HStack } from "../ui/hstack";
import { ModelAutocompleteDropdown } from "../common/ModelAutocompleteDropdown";

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
type BikeFrameProps = {
  bike: Bike;
  markDirty: () => void;
};

const BikeFrameComponent: React.FC<BikeFrameProps> = ({bike, markDirty }) => {
  console.log('BikeFrameComponent bike: ' + bike.name);
  const session = useSession();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();

  const email = session.email ? session.email : '';

  var bikeId = bike ? bike.id : 0;

  const isNew = bike.id === 0;
  const [bikeName, setBikeName] = useState(newBike.name);
  const [year, setYear] = useState('2022');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [groupsetBrand, setGroupsetBrand] = useState(newBike.groupsetBrand);
  const [speed, setSpeeds] = useState(newBike.groupsetSpeed.toString());
  const [type, setType] = useState(newBike.type);
  const [isElectronic, setIsElectronic] = useState(newBike.isElectronic);
  const [stravaId, setStravaId] = useState('');
  const [milage, setMileage] = useState(newBike.odometerMeters.toFixed(0));
  const [milageLabel, setMileageLabel] = useState('Mileage');
  const [isRetired, setIsRetired] = useState(newBike.isRetired);
  const [connectedToStrava, setConnectedToStrava] = useState(false);
  const [isInitialized, setIsInitialized] = useState(isNew);
  const [errorMessage, setErrorMessage] = useState('');
  const [preferences, setPreferences] = useState({ units: 'miles'});

  const controller = new BikeController(appContext);
  
  const resetBike = async (bike: Bike) => {
    console.log('Bike Frame bike: ' + bike.name);
    // console.log('reset bike: ' + JSON.stringify(bike));
    const pref = await controller.getUserPreferences(session);
    setPreferences(preferences);
    setMileageLabel('Mileage (' + pref.units + ')');
    setMileage(metersToDisplayString(bike.odometerMeters, pref));
    console.log('reset bike name: ' + bike.name);
    setBikeName(ensureString(bike.name));
    setGroupsetBrand(ensureString(bike.groupsetBrand));
    setSpeeds(ensureString(bike.groupsetSpeed));
    navigation.setOptions({ title: ensureString(bike.name) });
    checkConnectedToStrava(bike.stravaId);
  }

  const updateName = (name: string) => {
    console.log('update bike name: ' + name);
    bike.name = name;
    setBikeName(name);
    navigation.setOptions({ title: name });
    setErrorMessage('');
    markDirty();
  }

  const updateYear = (itemValue: string) => {
    if (itemValue.match(/^[0-9]*$/) && itemValue.length == 2) {
      if (itemValue != '20' && itemValue != '19') {
        const possibleYear = parseInt(itemValue);
        const basisYearString = new Date().getFullYear().toString().substr(2);
        const basisYear = parseInt(basisYearString) + 2;
        if (possibleYear >= basisYear ) {
          setYear('19' + itemValue);
        } else {
          setYear('20' + itemValue);
        }
        markDirty();
        return;
      }
    }
    if (itemValue.match(/^[0-9]*$/) && itemValue.length <= 4) {
      setYear(itemValue);
      markDirty();
    }
  }

  const updateGroupsetBrand = (itemValue: string) => {
    bike.groupsetBrand = itemValue;
    setGroupsetBrand(itemValue);
    markDirty();
  }

  const updateType = (itemValue: string) => {
    bike.type = itemValue;
    setType(itemValue);
    markDirty();
  }

  const updateSpeeds = (itemValue: string) => {
    const speed = parseInt(itemValue);
    setSpeeds(itemValue);
    if (speed >= 1 && speed <= 45) {
      bike.groupsetSpeed = speed;
      markDirty();
    }
  }

  const updateIsElectricAssist = (itemValue: boolean) => {
    bike.isElectronic = itemValue;
    setIsElectronic(itemValue);
    markDirty();
  }

  const updateIsRetired = (itemValue: boolean) => {
    bike.isRetired = itemValue;
    setIsRetired(itemValue);
    markDirty();
  }

  const updateMileage = async (mileage: string) => {
    bike.odometerMeters = displayStringToMeters(mileage, preferences);
    setMileage(metersToDisplayString(bike.odometerMeters, preferences));
    markDirty();
  }

  useEffect(() => {
    if (bike) {
      resetBike(bike);
      setIsInitialized(true);
    }
  }, [bike]);

  const checkConnectedToStrava = (stravaId: string | null) => {
    setConnectedToStrava(
      stravaId !== null 
        && stravaId !== ''
        && stravaId!= '0');
  }

  const groupsetOptions = groupsetBrands.map(brand => ({ label: brand, value: brand }));
  const speedOptions = groupsetSpeeds.map(speed => ({ label: speed, value: speed}));
  const typeOptions = types.map(type => ({ label: type, value: type }));

  return (
    <VStack className="w-full">
      <Text>Name</Text>
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
      >
        <InputField 
          autoComplete="off"
          value={bikeName}
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
      <Text>Year</Text>
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
      >
        <InputField 
          autoComplete="off"
          value={year}
          onChangeText={updateYear}
          placeholder="Enter bike year here..." 
          testID="yearInput"
          autoCapitalize="words"
          autoCorrect={false}
          keyboardType="numeric"
          accessibilityLabel="Year"
          accessibilityHint="The model year of the bike being edited"/>
      </Input>
      <HStack className="w-full bg-background-0 flex-grow justify-center">
        <VStack className="flex-1">
          <Text>Brand</Text>
          <BrandAutocompleteDropdown 
            session={session}
            value={brand}
            readonly={false}
            onSelect={setBrand}
          />
        </VStack>
        <VStack className="flex-1">
          <Text>Model</Text>  
          {/* TODO: reset bike doesn't update these */}
          <ModelAutocompleteDropdown 
            session={session}
            brand={brand}
            value={model}
            readonly={false}
            onSelect={setModel}
          />
        </VStack>
      </HStack>
      <Text>{milageLabel}</Text>
      <Input
        className="z-0"
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={connectedToStrava}>
          <InputField 
            className="z-0"
            value={milage}
            onChangeText={(value) => setMileage(value ? value : '')}
            readOnly={connectedToStrava}
            inputMode="numeric"
            testID="mileageField"
            accessibilityLabel="Milage"
            accessibilityHint="Mileage of the bike"/>
      </Input>
      <Text>Groupset</Text>
      <Dropdown
        initialLabel="Choose a groupset"
        options={groupsetOptions}
        value={groupsetBrand}
        testID="groupsetDropdown"
        onSelect={(value) => updateGroupsetBrand(value ? value : '')}
      />
      <Text>Type</Text>
      <Dropdown
        options={typeOptions}
        value={type}
        testID="typeDropdown"
        onSelect={(value) => updateType(value ? value : '')}
      />
      <Text>Speeds</Text>
      <Dropdown
        options={speedOptions}
        value={speed}
        testID="speedsDropdown"
        onSelect={(value) => updateSpeeds(value ? value : '')}
      />
      <Checkbox size="md"
          value="Electric Assist"
          isChecked={isElectronic} 
          onChange={(newVal) => updateIsElectricAssist(newVal)}
          accessibilityLabel="Has Electric Assist"> 
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>Electric Assist</CheckboxLabel>
      </Checkbox>
      <Checkbox size="md"
          value="Is Retired"
          isChecked={isRetired} 
          onChange={(newVal) => updateIsRetired(newVal)}
          accessibilityLabel="Is Retired"> 
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel>Retired</CheckboxLabel>
      </Checkbox>
    </VStack>
  );
};

export default BikeFrameComponent;