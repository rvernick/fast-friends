import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import { useNavigation, useRouter } from 'expo-router';
import { Button, Card, List, Text, useTheme, Surface } from 'react-native-paper';
import { Bike } from '../../models/Bike';
import { useSession } from '@/common/ctx';
import { MaintenanceItem } from '@/models/MaintenanceItem';
import MaintenanceListController from './MaintenanceListController';
import { Dropdown } from 'react-native-paper-dropdown';
import { Dimensions, ScrollView, View } from 'react-native';
import { createStyles, defaultWebStyles } from '@/common/styles';
import { distanceUnitDisplayString, isMobile, metersToDisplayString, today } from '@/common/utils';
import { useIsFocused } from '@react-navigation/native';

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
  const isFocused = useIsFocused();

  const controller = new MaintenanceListController(appContext);
  const preferences = controller.getUserPreferences(session);

  const [sortOption, setSortOption] = useState('Due');
  const [expandedBike, setExpandedBike] = useState(0);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

  const { data, error, isFetching } = useQuery({
    queryKey: ['bikes'],
    queryFn: () => controller.getCurrentBikes(session, email),
    initialData: [],
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })

  const addMaintenanceItem = () => {
    queryClient.removeQueries({ queryKey: ['maintenanceItems'] });
    router.push( { pathname: '/(home)/(maintenanceItems)', params: { id: '0', bikeid: expandedBike.toString() } });
  }

  const editMaintenanceItem = (id: number, bikeId: number) => {
    const idString = id.toString();
    const bikeIdString = bikeId.toString();
    console.log('editMaintenanceItem called: ' + idString +' bikeId: '+ bikeIdString);
    router.push( { pathname: '/(home)/(maintenanceItems)', params: { id: idString, bikeid: bikeIdString } });
  }

  const logMaintenance = () => {
    router.push({ pathname: '/(home)/(maintenanceItems)/log-maintenance', params: { bikeid: expandedBike } });
  }

  type MaintenanceListItemProps = {
    maintenanceItem: MaintenanceItem;
    bikeId: number;
  }

  const MaintenanceListItem: React.FC<MaintenanceListItemProps> = ({ maintenanceItem, bikeId }) => {
    const [description, setDescription ] = useState('');

    var keyVal = maintenanceItem.part + maintenanceItem.action;
    if (maintenanceItem.dueDistanceMeters && maintenanceItem.dueDistanceMeters > 0) {
      keyVal += 'at:'+ maintenanceItem.dueDistanceMeters;
    } else if (maintenanceItem.dueDate) {
      keyVal += 'by:'+ new Date(maintenanceItem.dueDate).toLocaleDateString('en-US');
    }

    const syncDescription = async () => {
      var desc = maintenanceItem.action;
      const prefs = await preferences;
      if (maintenanceItem.dueDistanceMeters && maintenanceItem.dueDistanceMeters > 0) {
        if (maintenanceItem.bikeDistance && maintenanceItem.bikeDistance > 0) {
          if (maintenanceItem.bikeDistance > maintenanceItem.dueDistanceMeters) {
            const metersOverdue = maintenanceItem.bikeDistance - maintenanceItem.dueDistanceMeters;
            desc += ' overdue: ' + metersToDisplayString(metersOverdue, prefs);
            desc += distanceUnitDisplayString(prefs);
            desc += ' ('+ metersToDisplayString(maintenanceItem.dueDistanceMeters, prefs) + ')';
          } else {
            const metersRemaining = maintenanceItem.dueDistanceMeters - maintenanceItem.bikeDistance;
            desc += ' in: '+ metersToDisplayString(metersRemaining, prefs);
            desc += distanceUnitDisplayString(prefs);
            desc += ' ('+ metersToDisplayString(maintenanceItem.dueDistanceMeters, prefs) + ')';
          }
        } else {
          desc += ' at: '+ metersToDisplayString(maintenanceItem.dueDistanceMeters, prefs);
        }
      }
      if (maintenanceItem.dueDate) {
        if (today().getTime() > new Date(maintenanceItem.dueDate).getTime()) {
          desc += ' overdue: ';
        } else {
          desc += ' by: ';
        }
        desc += new Date(maintenanceItem.dueDate).toLocaleDateString('en-US');
      }
      setDescription(desc);
    }

    useEffect(() => {
      syncDescription();
    }, []);

    return (
      <List.Item
        key={keyVal}
        title={maintenanceItem.part}
        id={'MLI' + keyVal}
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
    return items.sort((a, b) => dueDistanceVal(a) - dueDistanceVal(b));
  }

  const dueDistanceVal = (item: MaintenanceItem): number => {
    // assume 70k per week (10k/day) for due date calculation
    var daysDiffAsMeters = Infinity;
    if (item.dueDate) {
      const diff = new Date(item.dueDate).getTime() - today().getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      daysDiffAsMeters = item.bikeDistance + 10000 * days;
    }
    // return smaller of deadlines
    if (item.dueDistanceMeters && item.dueDistanceMeters > 0) {
      if (item.dueDistanceMeters < daysDiffAsMeters) {
        return item.dueDistanceMeters;
      }
    }
    return daysDiffAsMeters;
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
      setExpandedBike(0);
      return;
    }
  };

  const BikeAccordian: React.FC<BikeAccordainProps> = ({ bike}) => {
    const [description, setDescription ] = useState('');

    if (!bike.maintenanceItems || bike.maintenanceItems.length ==0) return null;
    const sortedItems = sortItems(bike.maintenanceItems);

    const syncDescription = async () => {
      const pref = await preferences;
      const val = metersToDisplayString(bike.odometerMeters, pref) + ' ' + pref.units;
      setDescription(val);
    }

    const keyFor = (maintenanceItem: MaintenanceItem): string => {
      var result = maintenanceItem.part + maintenanceItem.action;
      if (maintenanceItem.dueDistanceMeters && maintenanceItem.dueDistanceMeters > 0) {
        result += 'at:'+ maintenanceItem.dueDistanceMeters;
      } else if (maintenanceItem.dueDate) {
        result += 'by:'+ new Date(maintenanceItem.dueDate).toLocaleDateString('en-US');
      }
      return result;
    }

    useEffect(() => {
      syncDescription();
    }, []);

    const keyVal = "bikeAccordian" + bikeId(bike)
    return (
      <List.Accordion
          expanded={expandedBike === bike.id}
          title={bike.name}
          description={description}
          onPress={() => handleBikePress(bike.id)}
          key={'bike exa' + keyVal}
          id={'bike exa' + keyVal}>
        {sortedItems.map(maintenanceItem => (
          <MaintenanceListItem
            key={keyFor(maintenanceItem)}
            maintenanceItem={maintenanceItem}
            bikeId={bike.id}/>
        ))}
      </List.Accordion>
    );
  };
  
  type BikeListProps = {
    bikes: Bike[];
    sortBy: string;
  };

  const BikeListComponent: React.FC<BikeListProps> = ({ bikes, sortBy}) => {
    return (
      <List.Section>
        {getSortedBikes(bikes, sortBy).map(bike => (
          <BikeAccordian
            bike={bike}
            key={bike.id}
            sortBy={sortBy}
            isOpen={true}/>
        ))}
      </List.Section>
    );
  }

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

  const updateSorting = (newSortValue: string | undefined) => {
    const newSort = newSortValue ? newSortValue : 'A-Z';
    setSortOption(newSort);
  }

  const refresh = async () => {
    if (sortOption === 'A-Z') {
      setSortOption('Due');
    } else {
      setSortOption('A-Z');
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: 'Maintenance' });
    if (expandedBike === 0 && data && data.length > 0) {
      const bikeList = getSortedBikes(data, sortOption);
      handleBikePress(bikeList[0].id);
    }
  }, [data, isFocused]);

  if (!data || !isFocused || isFetching || data.length === 0) {
    return (
      <Surface style={useStyle.containerScreen}>
        <Text>
          No bikes found. Add a bike or sync with Strava.
        </Text>
        <Button
          style={{marginTop: 16}}
          mode="contained"
          onPress={refresh}> Refresh </Button>
      </Surface>
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
              mode="outlined"
              value={sortOption}
              options={sortOptions}
              onSelect={updateSorting}
              />      
          }/>
        </Card>
        <ScrollView contentContainerStyle={{flexGrow:1}} style={useStyle.containerBody}>
          <BikeListComponent bikes={data} sortBy={sortOption}/>
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

export const bikeId = (bike: Bike): string => {
  var dueMiles = 0;
  for (const item of bike.maintenanceItems) {
    dueMiles += item.dueDistanceMeters;
  }
  return bike.id.toString() + dueMiles.toString();
}
// navigation.push('Bike', { bike })

export const getSortedBikes = (bikes: Bike[] | null, sortBy: string): Bike[] => {
  if (!bikes) return [];
  if (sortBy === 'A-Z') {
    console.log('sort by A-Z sorting bikes');
    return bikes.sort((a, b) => compareName(a, b));
  }
  return bikes.sort((a, b) => soonestDue(b) - soonestDue(a));
}

const compareName = (a: Bike, b: Bike): number => {
  console.log('a.name:', a.name, 'b.name:', b.name);
  console.log(a.name.localeCompare(b.name));
  return a.name.localeCompare(b.name);
}

const soonestDue = (bike: Bike): number => {
  var smallest = 100000;
  for (const item of bike.maintenanceItems) {
    const overdue = bike.odometerMeters - item.dueDistanceMeters;
    smallest = Math.min(smallest, overdue);
  }
  return smallest;
}

export default MaintenanceComponent;
