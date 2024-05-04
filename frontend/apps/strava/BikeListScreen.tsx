import React, { useEffect, useState, useContext } from 'react';
import { Box, Center, Heading, VStack, ScrollView } from 'native-base';
import { GlobalStateContext } from "../config/GlobalContext";
import AppContext from "../config/app-context";
import BikeListController from './BikeListController';
import { useQuery, useQueryClient } from'@tanstack/react-query';

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
  const user = route.params.user;

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { status, data, error, isFetching } = useQuery({
    queryKey: [email],
    queryFn: () => controller.getBikes(email, appContext),
  })

  // Simulate fetching bikes from an API
  const fetchBikes = async () => {
    try {
      // Placeholder for actual fetch call
      // const response = await fetch('your-api-endpoint/bikes');
      // const data = await response.json();
      const data: Bike[] = [
        { id: '1', name: 'Mountain Explorer', type: 'Mountain' },
        { id: '2', name: 'Urban Speedster', type: 'Road' },
        // Add more bikes here
      ];
      setBikes(data);
    } catch (error) {
      console.error('Failed to fetch bikes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

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
            {loading ? (
              <Heading size="md" color="coolGray.600">Loading...</Heading>
            ) : (
              bikes.map(bike => (
                <Box key={bike.id} borderBottomWidth="1" _dark={{
                  borderColor: "gray.600"
                }} borderColor="coolGray.200" pl="4" pr="5" py="2">
                  <Heading size="sm">{bike.name}</Heading>
                  <Heading size="xs" color="coolGray.600">{bike.type}</Heading>
                </Box>
              ))
            )}
          </VStack>
        </ScrollView>
      </Box>
    </Center>
  );
};

export default BikeListScreen;