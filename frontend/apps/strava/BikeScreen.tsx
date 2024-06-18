import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Text, Button, Center, WarningOutlineIcon, Select, Checkbox, FlatList, HStack, Input } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import BikeController from './BikeController';
import MaintenanceList from "./MaintenanceList";
import { convertToMiles } from "./utils";

const groupsetBrands = [
  'Shimano',
  'SRAM',
  'Campagnolo',
  'Other',
]
const groupsetSpeeds = ['1', '9', '10', '11', '12', '13'];

export const BikeScreen = ({navigation, route, updateList}) => {
  const { appContext } = useContext(GlobalStateContext);
  console.log('Bike route: ' + JSON.stringify(route));
  const bike = route.params.bike;
  const isNew = bike.id == 0;
  const [bikeName, setBikeName] = useState(bike.name);
  var defaultMileage = '0';
  if (bike != null && bike.odometerMeters != null) {
    const bikeMiles = convertToMiles(bike.odometerMeters);
    defaultMileage = bikeMiles.toString();
  }
  const [mileage, setMileage] = useState(defaultMileage);
  const [mileageError, setMileageError] = useState('');
  const [readOnly, setReadOnly] = useState(!isNew);
  const [groupsetBrand, setGroupsetBrand] = useState(bike.groupsetBrand);
  var defaultGroupsetSpeed = 12;
  if (bike.groupsetSpeed != null) {
    defaultGroupsetSpeed = bike.groupsetSpeed;
  }
  const [speed, setSpeeds] = useState(defaultGroupsetSpeed.toString());
  const [isElectronic, setIsElectronic] = useState(bike.isElectronic);
  const [errorMessage, setErrorMessage] = useState('');
  const controller = new BikeController(appContext);

  const email = appContext.getEmail();
  const user = appContext.getUser();

  const editOrDone = (value) => {
    if (!readOnly) {
      updateBike();
    } else {
      setReadOnly(false);
    }
  }

  const updateBike = async function() {
    const result = await controller.updateBike(
      email,
      bike.id,
      bikeName,
      Number(mileage),
      groupsetBrand,
      speed,
      isElectronic);
    console.log('update bike result: ' + result);
    if (result == '') {
      navigation.push('BikeList');
    } else {
      setErrorMessage(result);
    }
  };

  const deleteBike = async function() {
    setErrorMessage('');
    const result = await controller.deleteBike(email, bike.id);
    if (result == '') {
      navigation.push('BikeList');
    } else {
      setErrorMessage(result);
    }
  }

  const cancel = () => {
    setReadOnly(true);
    setSpeeds(defaultGroupsetSpeed.toString());
    setGroupsetBrand(bike.groupsetBrand);
    setBikeName(bike.name);
    setIsElectronic(bike.isElectronic);
    setErrorMessage('');
  }

  const updateGroupsetBrand = (itemValue: string) => {
    setGroupsetBrand(itemValue);
  }

  const updateName = (name: string) => {
    const msg = controller.isValidName(name);
    if (msg.length > 0) {
      setErrorMessage(msg);
      return;
    }
    setBikeName(name);
    setErrorMessage('');
  }

  const updateMileage = (value) => {
    if (value.match(/^[0-9]*$/)) {
      setMileage(value);
      setMileageError('');
    } else {
      setMileageError('Mileage must be a number');
    }
  }

  const electricSelected = (value) => {
    console.log('electric selected:'+ value);
    if (!readOnly) {
      setIsElectronic(value);
    }
  }

  return <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          {bikeName}
        </Heading>
        <VStack space={3} mt="5">
          <FormControl isReadOnly={readOnly} isDisabled={readOnly} isRequired>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              isReadOnly={readOnly}
              value={bikeName}
              isRequired
              onChangeText={updateName}
            />
            <FormControl.ErrorMessage
                testID="error"
                leftIcon={<WarningOutlineIcon size="xs" />}>
                  { errorMessage }
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isReadOnly={readOnly} isDisabled={readOnly}>
          <FormControl.Label>Mileage</FormControl.Label>
            <Input
              testID="mileage"
              isReadOnly={readOnly}
              value={mileage}
              onChangeText={updateMileage}
            />
            <FormControl.ErrorMessage
              testID="mileageError"
              leftIcon={<WarningOutlineIcon size="xs" />}>
                { mileageError }
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isReadOnly={readOnly} isDisabled={readOnly}>
            <Select
              isDisabled={readOnly}
              selectedValue={groupsetBrand}
              onValueChange={updateGroupsetBrand}>
                { groupsetBrands.map(brand => (
                  <Select.Item key={brand} label={brand} value={brand} />
                  ))
                }
            </Select>
          </FormControl>
          <FormControl isReadOnly={readOnly} isDisabled={readOnly}>
            <Select
              isDisabled={readOnly}
              selectedValue={speed.toString()}
              onValueChange={setSpeeds}>
                { groupsetSpeeds.map(groupsetSpeed => (
                  <Select.Item key={groupsetSpeed} label={groupsetSpeed} value={groupsetSpeed} />
                  ))
                }
            </Select>
          </FormControl>
          <FormControl accessible={false} >
            <FormControl.Label accessibilityLabel={isElectronic ? "Is Electric" : "Is manual"}>Electric</FormControl.Label>
            <Checkbox
              aria-label="Is Electric"
              accessibilityLabel={isElectronic ? "Is Electric" : "Is manual"}
              isReadOnly={readOnly}
              isDisabled={readOnly}
              value="isElectronic"
              isChecked={isElectronic}
              onChange={electricSelected}>
            </Checkbox>
          </FormControl>
          <HStack>
            <Button onPress={ editOrDone } mt="2" colorScheme="indigo"
              isDisabled={!readOnly && bikeName.length > 0}>
                { readOnly ? 'Edit' : 'Done' }
            </Button>
            { (readOnly || isNew) ? null : <Button onPress={ cancel } mt="2" colorScheme="indigo"> Cancel </Button>}
            { (readOnly || isNew) ? null : <Button onPress={ deleteBike } mt="2" colorScheme="red"> Delete </Button>}
          </HStack>
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          Maintenance
        </Heading>

        </VStack>
      </Box>
      <MaintenanceList navigation={navigation} bike={bike}/>
    </Center>;
};
