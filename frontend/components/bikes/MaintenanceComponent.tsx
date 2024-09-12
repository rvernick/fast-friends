import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import { useNavigation, useRouter } from 'expo-router';
import { Button, Card, List, Text, useTheme, Surface } from 'react-native-paper';
import { Bike } from '../../models/Bike';
import { useSession } from '@/ctx';
import { MaintenanceItem } from '@/models/MaintenanceItem';
import MaintenanceListController from './MaintenanceListController';
import { Dropdown } from 'react-native-paper-dropdown';

type MaintenanceListProps = {
  bikes: Bike[] | null | undefined;
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
  const navigation = useNavigation();
  const controller = new MaintenanceListController(appContext);
  const [isUpdating, setIsUpdating] = useState(true);
  const [sortOption, setSortOption] = useState('A-Z');
  const [expandedBike, setExpandedBike] = useState(1);
  // const [sortOption, setSortOption] = useState('dueDate');

  const { status, data, error, isFetching } = useQuery({
    queryKey: ['bikes'],
    queryFn: () => controller.getBikes(session, email),
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })
  
  const addMaintenanceItem = () => {
    queryClient.removeQueries({ queryKey: ['maintenanceItems'] });
    router.push({ pathname: '/(maintenanceItems)/0', params: {bikeid: '0' }});
  }

  const editMaintenanceItem = (id: number, bikeId: number) => {
    const idString = id.toString();
    const bikeIdString = bikeId.toString();
    router.push({ pathname: '/(maintenanceItems)/' + idString,  params: {bikeid: bikeIdString }});
  }

  type MaintenanceListItemProps = {
    maintenanceItem: MaintenanceItem;
    bikeId: number;
  }

  const MaintenanceListItem: React.FC<MaintenanceListItemProps> = ({ maintenanceItem, bikeId }) => {
    return (
      <List.Item
        key={'mi' + maintenanceItem.id}
        title={maintenanceItem.part}
        id={'MLI' + bikeId}
        description={convertUnits(maintenanceItem.dueDistanceMeters)}
        onPress={() => editMaintenanceItem(maintenanceItem.id, bikeId)}
        left={props => <BikePartIcon maintenanceItem={maintenanceItem}/>}
      />
    );
  }

  type BikeAccordainProps = {
    bike: Bike;
    isOpen?: boolean;
    sortBy: string;
  };

  const sortOptions = ["A-Z", "Due"].map(option => ({ label: option, value: option}));

  const sortItems = (items: MaintenanceItem[]): MaintenanceItem[] => {
    if (sortOption === 'A-Z') {
      return items.sort((a, b) => a.part.localeCompare(b.part));
    } else if (sortOption === 'Due') {
      return items.sort((a, b) => a.dueDistanceMeters - b.dueDistanceMeters);
    }
    return items;
  }

  const handleBikePress = (bikeId: number) => {
   if (bikeId === expandedBike) {
     setExpandedBike(0);
   } else {
    setExpandedBike(bikeId);
   }
  }
  const BikeAccordian: React.FC<BikeAccordainProps> = ({ bike, isOpen}) => {
    if (!bike.maintenanceItems || bike.maintenanceItems.length ==0) return null;
    const sortedItems = sortItems(bike.maintenanceItems);
    return (
      <List.Accordion
          expanded={bike.id === expandedBike}
          title={bike.name}
          description={convertUnits(bike.odometerMeters)}
          onPress={() => handleBikePress(bike.id)}
          key={'bike exa' + bike.id}
          id={'bike exa' + bike.id}>
        {sortedItems.map(maintenanceItem => (
          <MaintenanceListItem maintenanceItem={maintenanceItem} bikeId={bike.id} key={'mlie' + maintenanceItem.id}/>
        ))}
      </List.Accordion>
    );
  };
  
  const MaintenanceList: React.FC<MaintenanceListProps> = ({ bikes, isUpdating }) => {
    if (!bikes || bikes == null || bikes?.length == 0) {
      return <Text>No Maintenance Items Found - Add a bike or sync with Strava</Text>
    }
    return (
      <Card>
        <Card.Title title="Sort By" right={() =>
          <Dropdown 
            value={sortOption}
            options={sortOptions}
            onSelect={(value) => setSortOption(value ? value : '')}
            />      
        }/>
        <Card.Content>
          <List.Section >
            {bikes?.map(bike => (
              <BikeAccordian
                bike={bike}
                sortBy={sortOption}
                isOpen={bike.id === expandedBike}
                key={bike.id}/>
            ))}
          </List.Section>
        </Card.Content>
      </Card>
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
    if (part === "Chain") {
      return (
        <List.Icon
          icon="link"
          color={theme.colors.primary}
        />
      );
    }
    if (part === "Cassette") {
      return (
        <List.Icon
          icon="cog"
          color={theme.colors.primary}
        />
      );
    }
    if (part === "Front Tire" || part === "Rear Tire") {
      return (
        <List.Icon
          icon="atom-variant"
          color={theme.colors.primary}
        />
      );
    }
    if (part === "Front Brake Pads" || part === "Rear Brake Pads") {
      return (
        <List.Icon
          icon="lungs"
          color={theme.colors.primary}
        />
      );
    }
    return (
      <List.Icon
        icon="bike"
        color={theme.colors.primary}
      />
    );
  };

  useEffect(() => {
    navigation.setOptions({ title: 'Maintenance' });
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
      <Card>
        {/* <Card.Actions>
          <Dropdown 
            label="Sort by"
            placeholder="dueDate"
            options={sortOptions}
            value={sortOption}
            onSelect={(value) => setSortOption(value ? value : '')}
          />
        </Card.Actions>
      </Card> */}
        <MaintenanceList bikes={data} isUpdating={isUpdating}/>
        <Button mode="contained" onPress={addMaintenanceItem}> Add Maintenance Item</Button>
        </Card>
    </Surface>
  );
};

// navigation.push('Bike', { bike })

const convertUnits = (meters: number): string => {
  return (meters / 1609).toFixed(0);
}

export default MaintenanceComponent;
