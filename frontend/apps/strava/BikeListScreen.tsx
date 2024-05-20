import React, { useEffect, useState, useContext } from 'react';
import { Box, Center, Heading, VStack, ScrollView } from 'native-base';
import { GlobalStateContext } from "../config/GlobalContext";
import BikeListController from './BikeListController';
import { useQuery } from'@tanstack/react-query';

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
  const email = appContext.getEmail();

  const { status, data, error, isFetching } = useQuery({
    queryKey: [email, 'bikes'],
    queryFn: () => controller.getBikes(email, appContext),
  })

  if (status === 'loading') {
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
            Loading...
          </Heading>
        </Box>
      </Center>
    )
  } else if (status === 'error') {
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
  } else {
    return (
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
            color: "warmGray.50"
          }}>
            Bike List
          </Heading>

          <ScrollView>
            <VStack space={4} mt="5">
              {data && data.length > 0 ? (
                data.map(bike => (
                  <Box key={bike.id} borderBottomWidth="1" _dark={{
                    borderColor: "gray.600"
                  }} borderColor="coolGray.200" pl="4" pr="5" py="2">
                    <Heading size="sm">{bike.name}</Heading>
                    <Heading size="xs" color="coolGray.600">{bike.type}</Heading>
                  </Box>
              ))) : (
                <Box> No Bikes Found</Box>
              )
            }
            </VStack>
          </ScrollView>
        </Box>
      </Center>
    );
  };
};

export default BikeListScreen;