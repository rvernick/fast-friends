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
import { Dimensions, ScrollView, View } from 'react-native';
import { createStyles, styles } from '@/common/styles';
import { isMobile, metersToDisplayString } from '@/common/utils';

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
  const preferences = controller.getUserPreferences(session);

  const [sortOption, setSortOption] = useState('Due');
  const [sortedBikes, setSortedBikes] = useState<Bike[]>([]);

  const [expandedBike, setExpandedBike] = useState(0);
  // const [sortOption, setSortOption] = useState('dueDate');

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles

  const { data, error, isFetching } = useQuery({
    queryKey: ['bikes'],
    queryFn: () => controller.getBikes(session, email),
    initialData: [],
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })
  
  const addMaintenanceItem = () => {
    queryClient.removeQueries({ queryKey: ['maintenanceItems'] });
    router.push( { pathname: '/(home)/(maintenanceItems)', params: { maintenanceId: '0', bikeId: expandedBike.toString() } });
  }

  const editMaintenanceItem = (id: number, bikeId: number) => {
    const idString = id.toString();
    const bikeIdString = bikeId.toString();
    router.push( { pathname: '/(home)/(maintenanceItems)', params: { maintenanceId: idString, bikeId: bikeIdString } });
  }

  const logMaintenance = () => {
    router.push({ pathname: '/(home)/(maintenanceItems)/log-maintenance', params: { bikeId: expandedBike } });
  }

  type MaintenanceListItemProps = {
    maintenanceItem: MaintenanceItem;
    bikeId: number;
  }

  const MaintenanceListItem: React.FC<MaintenanceListItemProps> = ({ maintenanceItem, bikeId }) => {
    const [description, setDescription ] = useState('');

    const syncDescription = async () => {
      setDescription(maintenanceItem.action +' at: ' + metersToDisplayString(maintenanceItem.dueDistanceMeters, await preferences));
    }

    useEffect(() => {
      syncDescription();
    }, []);

    return (
      <List.Item
        key={'mi' + maintenanceItem.id + 'milage' + maintenanceItem.dueDistanceMeters.toFixed(0)}
        title={maintenanceItem.part}
        id={'MLI' + bikeId}
        description={description}
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
    }
    // sort option Due by default
    return items.sort((a, b) => a.dueDistanceMeters - b.dueDistanceMeters);
  }

  const handleBikePress = (bikeId: number) => {
   if (!data || data.length == 0) return;
   if (data?.length == 1) {
    setExpandedBike(data[0].id);
    return;
   }
   if (expandedBike != bikeId) {
     setExpandedBike(bikeId);
     return;
   }
   if (expandedBike === bikeId) {
    const nextBike = data.find(bike => bike.id != expandedBike);
    if (nextBike) {
      setExpandedBike(nextBike.id);
      return;
    }
   }
  };

  const BikeAccordian: React.FC<BikeAccordainProps> = ({ bike, isOpen}) => {
    const [description, setDescription ] = useState('');

    if (!bike.maintenanceItems || bike.maintenanceItems.length ==0) return null;
    const sortedItems = sortItems(bike.maintenanceItems);

    const syncDescription = async () => {
      const pref = await preferences;
      const val = metersToDisplayString(bike.odometerMeters, pref) + ' ' + pref.units;
      setDescription(val);
    }

    useEffect(() => {
      syncDescription();
    }, []);

    return (
      <List.Accordion
          expanded={expandedBike === bike.id}
          title={bike.name}
          description={description}
          onPress={() => handleBikePress(bike.id)}
          key={'bike exa' + bike.id}
          id={'bike exa' + bike.id}>
        {sortedItems.map(maintenanceItem => (
          <MaintenanceListItem maintenanceItem={maintenanceItem} bikeId={bike.id} key={'mlie' + maintenanceItem.id}/>
        ))}
      </List.Accordion>
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

  const soonestDue = (bike: Bike): number => {
    var smallest = 100000;
    for (const item of bike.maintenanceItems) {
      const overdue = bike.odometerMeters - item.dueDistanceMeters;
      smallest = Math.min(smallest, overdue);
    }
    return smallest;
  }

  const getSortedBikes = (): Bike[] => {
    if (!data) return [];
    if (sortOption === 'A-Z') {
      return data.sort((a, b) => a.name.localeCompare(b.name));
    }
    return data.sort((a, b) => soonestDue(b) - soonestDue(a));
  }

  useEffect(() => {
    navigation.setOptions({ title: 'Maintenance' });
    if (expandedBike === 0 && data && data.length > 0) {
      const bikeList = getSortedBikes();
      setSortedBikes(bikeList);
      handleBikePress(bikeList[0].id);
    }
    
  }, [data]);

  if (!data || isFetching || data.length === 0) {
    return (
      <Text>
        No bikes found. Add a bike or sync with Strava.
      </Text>
    )
  } else if (error) {
    return (
      <Text>
        An error occured!
      </Text>
    )
  } else {
    return (
      <Surface style={useStyle.containerScreen}>
        <Card style={useStyle.input} >
          <Card.Title title="Sort By:" right={() =>
            <Dropdown 
              value={sortOption}
              options={sortOptions}
              onSelect={(value) => setSortOption(value ? value : 'A-Z')}
              />      
          }/>
        </Card>
          <ScrollView contentContainerStyle={{flexGrow:1}} style={useStyle.containerBody}>
            <List.Section>
              {sortedBikes?.map(bike => (
                <BikeAccordian
                  bike={bike}
                  sortBy={sortOption}
                  isOpen={true}
                  // isOpen={bike.id === expandedBike}
                  key={bike.id}/>
              ))}
            </List.Section>
        </ScrollView>
        <Surface style={useStyle.bottomButtons}>
          <Button
            style={{flex: 1}}
            mode="contained"
            onPress={addMaintenanceItem}>
              Add Maintenance Item
          </Button>
          <Button
            style={{flex: 1}}
            mode="contained"
            onPress={logMaintenance}>
              Log Maintenance
          </Button>
        </Surface>
      </Surface>
    );
  }
};

// navigation.push('Bike', { bike })

export default MaintenanceComponent;
