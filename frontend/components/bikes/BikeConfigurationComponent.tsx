import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, metersToDisplayString } from "@/common/utils";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Input, InputField } from "../ui/input";
import { Alert, AlertIcon, AlertText } from "../ui/alert";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, InfoIcon } from "lucide-react-native";
import { BikeDefinitionSummary } from "@/models/BikeDefinition";
import { BrandAutocompleteDropdown } from "../common/BrandAutocompleteDropdown";
import { HStack } from "../ui/hstack";
import { ModelAutocompleteDropdown } from "../common/ModelAutocompleteDropdown";
import { ScrollView } from "../ui/scroll-view";
// import { LineAutocompleteDropdown } from "../common/LineAutocompleteDropdown"; // Removed as lines is too hard for now
import { getBikeDefinitions, getLines } from "@/common/data-utils";
import { Pressable } from "../ui/pressable";
import { BikeIcon } from "lucide-react-native";

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

const BikeConfigurationComponent: React.FC<BikeFrameProps> = ({bike, markDirty }) => {
  console.log('BikeFrameComponent bike: ' + bike.name);
  const session = useSession();
  const appContext = useGlobalContext();

  const email = session.email ? session.email : '';

  var bikeId = bike ? bike.id : 0;

  const isNew = bike.id === 0;
  const [bikeName, setBikeName] = useState(bike.name);
  const [year, setYear] = useState('2022');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [lines, setLines] = useState<string[]>([]);
  const [line, setLine] = useState('');
  const [groupsetBrand, setGroupsetBrand] = useState(bike.groupsetBrand);
  const [speed, setSpeeds] = useState(bike.groupsetSpeed.toString());
  const [type, setType] = useState(bike.type);
  const [isElectronic, setIsElectronic] = useState(bike.isElectronic);
  const [stravaId, setStravaId] = useState('');
  const [milage, setMileage] = useState(bike.odometerMeters.toFixed(0));
  const [milageLabel, setMileageLabel] = useState('Mileage');
  const [isRetired, setIsRetired] = useState(bike.isRetired);
  const [connectedToStrava, setConnectedToStrava] = useState(false);
  const [isInitialized, setIsInitialized] = useState(isNew);
  const [errorMessage, setErrorMessage] = useState('');
  const [preferences, setPreferences] = useState({ units: 'miles'});
  const [possibleDefinitions, setPossibleDefinitions] = useState<BikeDefinitionSummary[]>([]);
  const [definition, setDefinition] = useState<BikeDefinitionSummary | null>(null);

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
    checkConnectedToStrava(bike.stravaId);
    if (bike.bikeDefinitionSummary) {
      console.log('update bike definition: ' + JSON.stringify(bike.bikeDefinitionSummary));
      setDefinition(bike.bikeDefinitionSummary);
      setYear(bike.bikeDefinitionSummary.year);
      setBrand(bike.bikeDefinitionSummary.brand);
      setModel(bike.bikeDefinitionSummary.model);
      if (bike.bikeDefinitionSummary.line) {
        setLine(bike.bikeDefinitionSummary.line);
      }
      console.log('updated bike definition:');
    } else {
      setDefinition(null);
      setYear(ensureString(bike.year));
      setBrand(ensureString(bike.brand))
      setModel(ensureString(bike.model))
      setLine(ensureString(bike.line))
    }
  }

  const updateName = (name: string) => {
    console.log('update bike name: ' + name);
    bike.name = name;
    setBikeName(name);
    setErrorMessage('');
    markDirty();
  }

  const updateYear = (itemValue: string) => {
    if (!itemValue.match(/^[0-9]*$/)) return;
    var updatedYear = itemValue;

    if (itemValue.match(/^[0-9]*$/) && itemValue.length == 2) {
      if (itemValue != '20' && itemValue != '19') {
        const possibleYear = parseInt(itemValue);
        const basisYearString = new Date().getFullYear().toString().substr(2);
        const basisYear = parseInt(basisYearString) + 2;
        if (possibleYear >= basisYear ) {
          updatedYear = '19' + itemValue;
        } else {
          updatedYear = '20' + itemValue;
        }
      }
    }

    setYear(updatedYear);
    if (updatedYear.length == 4) {
      bike.year = updatedYear;
    }
    markDirty();
  }

  const validateYear = () => {
    if (year.length == 0 || year.length == 4) return

    setYear(ensureString(bike.year));
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

  const syncLines = async (brand: string, model: string) => {
    if (model && brand.length > 0 && model.length > 0) {
      const lines = await getLines(session, brand, model);
      setLines(lines);
    } else {
      setLines([]);
    }
  }

  useEffect(() => {
    if (bike) {
      resetBike(bike);
      setIsInitialized(true);
    }
  }, [bike]);

  useEffect(() => {
    syncLines(brand, model);
  }, [brand, model]);

  const updateBrand = (newBrand: string) => {
    const oldBrand = brand;
    setBrand(newBrand);
    bike.brand = newBrand;
    if (shouldReset(newBrand, oldBrand)) {
      updateModel('');
      setDefinition(null);
    }
  }

  const updateModel = (newModel: string) => {
    const oldModel = model;
    setModel(newModel);
    bike.model = newModel;
    if (shouldReset(newModel, oldModel)) {
      updateLine('');
      setDefinition(null);
    } else {
      searchPossibleDefinitions(year, brand, newModel, line);
    }
  }

  const updateLine = (newLine: string) => {
    const oldLine = line;
    setLine(newLine);
    bike.line = newLine;
    searchPossibleDefinitions(year, brand, model, newLine);
  }

  const shouldReset = (newVal: string, oldVal: string) => {
    if (newVal.startsWith(oldVal)) return false;
    return true;
  }

  const searchPossibleDefinitions = async (year: string, brand: string, model: string, line: string) => {
    const newDefinitions = await getBikeDefinitions(session, year, brand, model, line);
    const exactMatch = findExactDefinition(newDefinitions, year, brand, model, line);
    if (exactMatch) {
      console.log('BikeFrameComponent exact match found', exactMatch);
    } else {
      console.log('BikeFrameComponent no exact match found', );
    }
    if (newDefinitions.length > 10) {
      setPossibleDefinitions(newDefinitions.slice(0, 10));
    } else {
      setPossibleDefinitions(newDefinitions);
    }
  }

  const findExactDefinition = (definitions: BikeDefinitionSummary[], year: string, brand: string, model: string, line: string) => {
    return definitions.find(d => d.year === year && d.brand === brand && d.model === model && d.line === line);
  }

  const chooseDefinition = (definition: BikeDefinitionSummary) => {
    console.log('BikeFrameComponent choosing definition', definition);
    setDefinition(definition);
    bike.bikeDefinitionSummary = definition;
    if (definition) {
      bike.groupsetBrand = definition.groupsetBrand
      bike.groupsetSpeed = definition.groupsetSpeed;
      setYear(definition.year);
      setBrand(definition.brand);
      setModel(definition.model);
      setLine(definition.line);
      setSpeeds(definition.groupsetSpeed.toString());
    } else {
      setBrand(bike.groupsetBrand);
      setSpeeds(bike.groupsetSpeed.toString());
    }
    setErrorMessage('');
    markDirty();
  }

  const checkConnectedToStrava = (stravaId: string | null) => {
    setConnectedToStrava(
      stravaId !== null
        && stravaId !== ''
        && stravaId!= '0');
  }

  type BikeDetailsProps = {
    bike: Bike;
    bikeDefinitionSummary: BikeDefinitionSummary | null;
  }

  const BikeDetailsComponent: React.FC<BikeDetailsProps> = ({ bike, bikeDefinitionSummary }) => {
    return (
      <VStack>
        <Text>Brand: {bikeDefinitionSummary?.brand}</Text>
        <Text>Model: {bikeDefinitionSummary?.model}</Text>
        <Text>Line: {bikeDefinitionSummary?.line}</Text>
        <Text>Groupset: {bike.groupsetBrand} {bikeDefinitionSummary?.groupsetLine}</Text>
        <Text>Type: {bike.type}</Text>
        <Text>Speeds: {bike.groupsetSpeed} speed</Text>
        <Text>Electric assist: {bike.isElectronic? 'Yes' : 'No'}</Text>
        <Text>Retired: {bike.isRetired? 'Yes' : 'No'}</Text>
      </VStack>
    )
  }

  type BikeDefinitionProps = {
    bikeDefinition: BikeDefinitionSummary;
    bike: Bike;
  };

  const BikeDefinitionComponent: React.FC<BikeDefinitionProps> = ({ bikeDefinition, bike }) => {
    const [description, setDescription ] = useState('');

    const syncDescription = async () => {
      const val = bikeDefinition.year + ' ' + bikeDefinition.brand +' ' + bikeDefinition.model +' ' + bikeDefinition.line;
      setDescription(val);
    }
      useEffect(() => {
        syncDescription();
      }, []);

      return (
        <HStack className="w-full" key={"bike-" + bike.id}>
          <BikeIcon size="24"/>
          <VStack>
            <Text>{description}</Text>
            <HStack>
              <Text>{bikeDefinition.groupsetBrand} </Text>
              <Text>{bikeDefinition.groupsetLine} </Text>
              <Text>{bikeDefinition.groupsetSpeed} speed</Text>
            </HStack>
          </VStack>
        </HStack>
      )
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
      <HStack className="w-full bg-background-0 flex-grow ">
        <VStack className="w-full">
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
              onBlur={validateYear}
              placeholder="Enter bike year here..."
              testID="yearInput"
              autoCapitalize="words"
              autoCorrect={false}
              keyboardType="numeric"
              accessibilityLabel="Year"
              accessibilityHint="The model year of the bike being edited"/>
          </Input>
        </VStack>
      </HStack>
      <HStack className="w-full bg-background-0 justify-stretch">
        <VStack className="flex-grow ">
          <Text>Brand</Text>
          <BrandAutocompleteDropdown
            session={session}
            value={brand}
            readonly={false}
            onSelect={updateBrand}
          />
        </VStack>
        <VStack className="flex-grow ">
          <Text>Model</Text>
          {/* TODO: reset bike doesn't update these */}
          <ModelAutocompleteDropdown
            session={session}
            brand={brand}
            value={model}
            readonly={false}
            onSelect={updateModel}
          />
        </VStack>
      </HStack>
      {/*Will potentially add line back {model && model.length > 0 ? (
          <Text>Line</Text>
        ) : null
      }
      {model && model.length > 0 ? (
        <LineAutocompleteDropdown
          session={session}
          brand={brand}
          model={model}
          value={line}
          readonly={false}
          blankPlaceholder={definition != null}
          onSelect={updateLine}
        />
        ) : null
      } */}
      <VStack>
        <ScrollView>
          {definition == null ? (
            possibleDefinitions.map((definition) => (
              <Pressable key={definition.id} onPress={() => chooseDefinition(definition)}>
                <BikeDefinitionComponent key={definition.id} bikeDefinition={definition} bike={bike}/>
              </Pressable>
            ))
            ) : (
              <BikeDetailsComponent bikeDefinitionSummary={definition} bike={bike}/>
            )
          }
        </ScrollView>
      </VStack>
      {/* <ScrollView
        className="w-full h-full"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {possibleDefinitions.map((definition) => (
          <BikeDefinitionComponent bikeDefinition={definition} bike={bike}/>
        ))}
      </ScrollView>
       */}

    </VStack>
  );
};

export default BikeConfigurationComponent;

/**
 *
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
 */