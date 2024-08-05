import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import BikeListController from './BikeListController';
import { useRouter } from 'expo-router';
import { ThemedView } from '../ThemedView';
import { Button, Card, List, Text } from 'react-native-paper';
import { Bike } from '../../models/Bike';
import { useSession } from '@/ctx';
import { MaintenanceItem } from '@/models/MaintenanceItem';
import MaintenanceListController from './MaintenanceListController';
import { Dropdown } from 'react-native-paper-dropdown';

type MaintenanceListProps = {
  maintenanceItems: MaintenanceItem[] | undefined;
  isUpdating: boolean;
};

const MaintenanceComponent = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const email = session.email ? session.email : '';
  const appContext = useGlobalContext();
  const router = useRouter();
  const controller = new MaintenanceListController(appContext);
  const [isUpdating, setIsUpdating] = useState(true);

  const [sortOption, setSortOption] = useState('dueDate');

  const { status, data, error, isFetching } = useQuery({
    queryKey: ['maintenanceItems'],
    queryFn: () => controller.getMaintenanceItems(session, email),
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })
  
  const addMaintenanceItem = () => {
    queryClient.removeQueries({ queryKey: ['maintenanceItems'] });
    router.push({ pathname: "0", params: {maintenanceItem: 0 }});
  }

  const editMaintenanceItem = (id: number) => {
    const idString = id.toString();
    router.push({ pathname: idString})
  }
  const MaintenanceList: React.FC<MaintenanceListProps> = ({ maintenanceItems, isUpdating }) => {
    return (
      <List.Section>
        {maintenanceItems && maintenanceItems.length > 0 ? (
          maintenanceItems.map(maintenanceItem => (
            <Card key={maintenanceItem.id} style={{ marginBottom: 10 }}>
              <Card.Title title={maintenanceItem.name} />
              <Card.Content>
                <Text>Due Distance: {maintenanceItem.dueDistance}</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => editMaintenanceItem(maintenanceItem.id)}>Edit</Button>
              </Card.Actions>
            </Card>
          ))
        ) : (
          <Text>No MaintenanceItems Found</Text>
        )}
      </List.Section>
    );
  };

  useEffect(() => {
    if (isUpdating && !isFetching) {
      console.log('sync updating bikes');
      setIsUpdating(false);
    }
  });

  const sortOptions = ["dueDate", "lastUpdate", "A-Z"].map(option => ({ label: option, value: option}));

  if (error) {
    return (
      <Text>
        An error occured!
      </Text>
    )
  }
  return (
    <ThemedView>
      <Card>
        <Card.Actions>
          <Dropdown 
            label="Sort by"
            placeholder="dueDate"
            options={sortOptions}
            value={sortOption}
            onSelect={(value) => setSortOption(value ? value : '')}
          />
        </Card.Actions>
      </Card>
        <MaintenanceList maintenanceItems={data} isUpdating={isUpdating}/>
        <Button mode="contained" onPress={addMaintenanceItem}> Add Maintenance Item</Button>
    </ThemedView>
  );
};

// navigation.push('Bike', { bike })

export default MaintenanceComponent;
