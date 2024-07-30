import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import BikeListController from './BikeListController';
import { useRouter } from 'expo-router';
import { ThemedView } from '../ThemedView';
import { Button, List, Text } from 'react-native-paper';
import { Bike } from '../../models/Bike';

type BikeListProps = {
  bikes: Bike[] | undefined;
  isUpdating: boolean;
};

// Example component
const BikeListComponent = () => {
  const appContext = useGlobalContext();
  const router = useRouter();
  const controller = new BikeListController(appContext);
  const [isUpdating, setIsUpdating] = useState(true);

  const email = controller.getEmail();

  const queryClient = useQueryClient();

  const { status, data, error, isFetching } = useQuery({
    queryKey: [email, 'bikes'],
    queryFn: () => controller.getBikes(email, appContext),
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })
  
  const addBike = () => {
    router.push({ pathname: "bike", params: {bike: 0 }});
  }

  const editBike = (id: number) => {
    router.push({ pathname: 'bike', params: { bike: id }})
  }

  const BikeList: React.FC<BikeListProps> = ({ bikes, isUpdating }) => {
    return (
    <List.Section>
          {bikes && bikes.length > 0? (
            bikes.map(bike => (
              <List.Item key={bike.id} title={bike.name} description={bike.type}
                onPress={() => editBike(bike.id)}/>
          ))) : (
            <Text> No Bikes Found</Text>
          )
        }
      </List.Section>
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
      <Text>
        An error occured!
      </Text>
    )
  }
  return (
    <ThemedView>
        <BikeList bikes={data} isUpdating={isUpdating}/>
        <Button onPress={addBike}> Add Bike</Button>
    </ThemedView>
  );
};

// navigation.push('Bike', { bike })

export default BikeListComponent;