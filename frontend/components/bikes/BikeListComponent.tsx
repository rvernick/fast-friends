import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import BikeListController from './BikeListController';
import { useRouter } from 'expo-router';
import { Button, List, Text, Surface } from 'react-native-paper';
import { Bike } from '../../models/Bike';
import { useSession } from '@/ctx';
import { styles } from '@/common/styles';
import { ScrollView } from 'react-native';

type BikeListProps = {
  bikes: Bike[] | undefined;
  isUpdating: boolean;
};

// Example component
const BikeListComponent = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext = useGlobalContext();
  const router = useRouter();
  const controller = new BikeListController(appContext);
  const [isUpdating, setIsUpdating] = useState(true);

  const { status, data, error, isFetching } = useQuery({
    queryKey: ['bikes'],
    queryFn: () => controller.getBikes(session, email),
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })
  
  const addBike = () => {
    queryClient.removeQueries({ queryKey: ['bikes'] });
    router.push({ pathname: "0", params: {bikeid: 0 }});
  }

  const editBike = (id: number) => {
    const idString = id.toString();
    router.push({ pathname: '/(bikes)/' + idString });
  }

  const BikeList: React.FC<BikeListProps> = ({ bikes, isUpdating }) => {
    return (
    <List.Section>
          {bikes && bikes.length > 0? (
            bikes?.map(bike => (
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
    <Surface>
      <ScrollView style={styles.containerOneBottom}>
        <BikeList bikes={data} isUpdating={isUpdating}/>
      </ScrollView>
      <Button mode="contained" onPress={addBike}> Add Bike</Button>
    </Surface>
  );
};

// navigation.push('Bike', { bike })

export default BikeListComponent;
