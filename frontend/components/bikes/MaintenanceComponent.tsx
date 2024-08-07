import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import BikeListController from './BikeListController';
import { useRouter } from 'expo-router';
import { ThemedView } from '../ThemedView';
import { Button, Card, List, Text, useTheme } from 'react-native-paper';
import { Bike } from '../../models/Bike';
import { useSession } from '@/ctx';
import { MaintenanceItem } from '@/models/MaintenanceItem';
import MaintenanceListController from './MaintenanceListController';
import { Dropdown } from 'react-native-paper-dropdown';

type MaintenanceListProps = {
  maintenanceItems: MaintenanceItem[] | undefined;
  isUpdating: boolean;
};

type MaintenanceItemProps = {
  maintenanceItem: MaintenanceItem;
}

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
            <List.Item
              title={maintenanceItem.part}
              description={maintenanceItem.dueDistanceMeters}
              left={props => <BikePartIcon maintenanceItem={maintenanceItem} />}
            />
          ))
        ) : (
          <Text>No MaintenanceItems Found</Text>
        )}
      </List.Section>
    );
  };

  /**
   * 
   * @param param0 CHAIN = "Chain",
  CASSETTE = "Cassette",
  FRONT_TIRE = "Front Tire",
  REAR_TIRE = "Rear Tire",
  CRANKSET = "Crankset",
  FRONT_BRAKE_CABLE = "Front Brake Cable",
  REAR_BRAKE_CABLE = "Rear Brake Cable",
  FRONT_BRAKE_PADS = "Front Brake Pads",
  REAR_BRAKE_PADS = "Rear Brake Pads",
  REAR_SHIFTER_CABLE = "Rear Shifter Cable",
  FRONT_SHIFTER_CABLE = "Front Shifter Cable",
  BAR_TAPER = "Bar Tape",
  TUNE_UP = "Tune Up",
   * @returns 
   */
  const BikePartIcon: React.FC<MaintenanceItemProps> = ({ maintenanceItem }) => {
    const theme = useTheme();
    const part = maintenanceItem.part;
    console.log('part ', part);
    if (part === "Chain") {
      return (
        <List.Icon
          icon={require('../../assets/images/chain.svg')}
          color={theme.colors.primary}
        />
      );
    }
    if (part === "Cassette") {
      return (
        <List.Icon
          icon={require('../../assets/images/cassette.svg')}
        />
      );
    }
    return (
      <List.Icon
        icon="bike"
      />
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
