import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, Center, WarningOutlineIcon, Select, Checkbox } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import { StravaComponent } from '../settings/StravaComponent';

export const BikeScreen = ({ navigation, route }) => {
  const { appContext } = useContext(GlobalStateContext);
  console.log('Bike route: ' + JSON.stringify(route));
  const bike = route.params.bike;
  console.log('Bike: ' + bike.name);
  console.log('Bike: ' + bike.groupsetBrand);
  const [bikeName, setBikeName] = useState(bike.name);
  const [readOnly, setReadOnly] = useState(true);
  const [groupsetBrand, setGroupsetBrand] = useState(bike.groupsetbrand);
  const [isElectronic, setIsElectronic] = useState(bike.isElectronic);
  // 'bike.isElectronic');

  const email = appContext.getEmail();
  const user = appContext.getUser();

  const groupsetBrands = [
    'Shimano',
    'SRAM',
    'Campagnolo',
    'Other',
  ]
  const updateAccount = function() {

  };

  return <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          {bikeName + ' ' + bike.groupsetbrand}
        </Heading>
        <VStack space={3} mt="5">
          <FormControl isReadOnly={readOnly} isDisabled={readOnly}>
            <Select
              isDisabled={readOnly}
              selectedValue={groupsetBrand}
              onValueChange={itemValue => setGroupsetBrand(itemValue)}>
                { groupsetBrands.map(brand => (
                  <Select.Item key={brand} label={brand} value={brand} />
                  ))
                }
            </Select>
          </FormControl>
          <FormControl >
            <FormControl.Label>Electric</FormControl.Label>
            <Checkbox
              value="isElectronic"
              isChecked={isElectronic}
              onChange={values => setIsElectronic(!isElectronic)}>
            </Checkbox>
          </FormControl>
          <Button onPress={ () => setReadOnly(!readOnly) } mt="2" colorScheme="indigo">
              { readOnly? 'Edit' : 'Done' }
            </Button>
        </VStack>
      </Box>
    </Center>;
};
