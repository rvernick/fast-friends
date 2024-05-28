import React, { useEffect, useState, useContext } from 'react';
import { Box, Center, Heading, VStack, ScrollView, Button, Spinner } from 'native-base';
import { GlobalStateContext } from "../config/GlobalContext";
import BikeListController from './BikeListController';
import { useQuery } from'@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

// Assuming you have a Bike type
type Bike = {
  id: string;
  name: string;
  type: string; // Example: Road, Mountain, etc.
};


// Example component
const BikeListScreen = ({ navigation, route }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new BikeListController(appContext);
  const [isUpdating, setIsUpdating] = useState(true);

  const email = appContext.getEmail();

  appContext.getQueryClient
  const { status, data, error, isFetching } = useQuery({
    queryKey: [email, 'bikes'],
    queryFn: () => controller.getBikes(email, appContext),
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })

  const addBike = () => {
    const newBike = {
      id: 0,
      name: '',
      groupsetBrand: 'Shimano',
      groupsetSpeed: 11,
      isElectronic: false,
    }
    navigation.push('Bike', { bike: newBike });
  }

  const editBike = (bike) => {
    navigation.push('Bike', { bike: bike })
  }

  const BikeListComponent = ({ data, isUpdating }) => {
    return (
      <ScrollView>
        <VStack space={isUpdating ? 5 : 4} mt="5">
          {data && data.length > 0? (
            data.map(bike => (
              <Box key={bike.id} borderBottomWidth="1" _dark={{
                borderColor: "gray.600"
              }} borderColor="coolGray.200" pl="4" pr="5" py="2">
                <Button key={bike.id}
                  onPress={() => editBike(bike)}
                  colorScheme='indigo'>
                  {bike.name}
                </Button>
              </Box>
          ))) : (
            <Box> No Bikes Found</Box>
          )
        }
        </VStack>
      </ScrollView>
    );
  };

  useEffect(() => {
    if (isUpdating && !isFetching) {
      console.log('sync updating bikes');
      setIsUpdating(false);
    }
  });

  if (error) {
    return (
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
            Bike List
          </Heading>
          <Heading mt="1" _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="xs">
            An error occured!
          </Heading>
        </Box>
      </Center>
    )
  }
  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
          Bike List
        </Heading>
        <MySpinner isVisible={isUpdating}/>
        <BikeListComponent data={data} isUpdating={isUpdating}/>
        <Button onPress={addBike}> Add Bike</Button>
      </Box>
    </Center>
  );
};


const MySpinner = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }
  return (
    <Spinner animating={isVisible} />
  );
};

// navigation.push('Bike', { bike })

export default BikeListScreen;