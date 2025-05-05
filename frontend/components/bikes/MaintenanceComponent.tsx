import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from'@tanstack/react-query';
import { useGlobalContext } from '@/common/GlobalContext';
import { useNavigation, useRouter } from 'expo-router';
import { Bike } from '../../models/Bike';
import { useSession } from '@/common/ctx';
import { MaintenanceItem } from '@/models/MaintenanceItem';
import MaintenanceListController from './MaintenanceListController';
import { distanceUnitDisplayString, ensureString, isMobile, metersToDisplayString, today } from '@/common/utils';
import { useIsFocused } from '@react-navigation/native';
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Dropdown } from '../common/Dropdown';
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Button, ButtonText } from '../ui/button';
import { Text } from '../ui/text';

import {
  Link2Icon,
  BikeIcon,
  LoaderPinwheelIcon,
  CogIcon,
  WrenchIcon,
  CableIcon,
  OctagonMinusIcon,
  BatteryChargingIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CircleDotDashedIcon,
  CircleSlash2Icon,
  SprayCanIcon,
} from "lucide-react-native"
import { Pressable } from '../ui/pressable';
import { Spinner } from '../ui/spinner';
import { View } from 'react-native';

interface BikeMaintenanceListItem {
  bike: Bike;
  maintenanceItem: MaintenanceItem | null;
  expanded: boolean;
  key: string;
}

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
  const [expandedBike, setExpandedBike] = useState<number>(0);
  const [listItems, setListItems ] = useState<BikeMaintenanceListItem[]>([]);
  const [bikeItemsMap, setBikeItemsMap ] = useState<Map<number, BikeMaintenanceListItem>>(new Map());

  const { data, error, isFetching } = useQuery({
    queryKey: ['bikes'],
    queryFn: () => controller.getCurrentBikes(session, email),
    initialData: [],
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  })

  const defaultBikeId = (): number => {
    if (expandedBike == 0) {
      return firstExpandedBike();
    }
    return expandedBike;
  }

  const firstExpandedBike = (): number => {
    for (let [bikeId, bikeItem] of bikeItemsMap.entries()) {
      if (bikeItem.expanded) {
        return bikeId;
      }
    }
    return 0;
  }

  const addMaintenanceItem = () => {
    queryClient.removeQueries({ queryKey: ['maintenanceItems'] });
    router.push( { pathname: '/(home)/(maintenanceItems)', params: { id: '0', bikeid: ensureString(defaultBikeId()) } });
  }

  const logMaintenance = () => {
    router.push({ pathname: '/(home)/(maintenanceItems)/log-maintenance', params: { bikeid: ensureString(defaultBikeId()) } });
  }

  const sortOptions = ["A-Z", "Due"].map(option => ({ label: option, value: option}));

  const sortItems = (items: MaintenanceItem[], sortBy: string): MaintenanceItem[] => {
    if (sortBy === 'A-Z') {
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


  type MaintenanceItemCompProps = {
    item: BikeMaintenanceListItem;
    maintenanceItem: MaintenanceItem;
  };
  const MaintenanceItemComp: React.FC<MaintenanceItemCompProps> = ({ item, maintenanceItem }) => {
    const [description, setDescription ] = useState('');

    const syncDescription = async (mi: MaintenanceItem) => {
      var desc = mi.action;
      const prefs = await preferences;
      if (mi.dueDistanceMeters && mi.dueDistanceMeters > 0) {
        if (mi.bikeDistance && mi.bikeDistance > 0) {
          if (mi.bikeDistance > mi.dueDistanceMeters) {
            const metersOverdue = mi.bikeDistance - mi.dueDistanceMeters;
            desc += ' overdue: ' + metersToDisplayString(metersOverdue, prefs);
            desc += distanceUnitDisplayString(prefs);
            desc += ' ('+ metersToDisplayString(mi.dueDistanceMeters, prefs) + ')';
          } else {
            const metersRemaining = mi.dueDistanceMeters - mi.bikeDistance;
            desc += ' in: '+ metersToDisplayString(metersRemaining, prefs);
            desc += distanceUnitDisplayString(prefs);
            desc += ' ('+ metersToDisplayString(mi.dueDistanceMeters, prefs) + ')';
          }
        } else {
          desc += ' at: '+ metersToDisplayString(mi.dueDistanceMeters, prefs);
        }
      }
      if (mi.dueDate) {
        if (today().getTime() > new Date(mi.dueDate).getTime()) {
          desc += ' overdue: ';
        } else {
          desc += ' by: ';
        }
        desc += new Date(mi.dueDate).toLocaleDateString('en-US');
      }
      setDescription(desc);
    }

    const editMaintenanceItem = () => {
      const bikeId = item.bike.id;
      const id = item.maintenanceItem ? item.maintenanceItem.id : 0;
      console.log('editMaintenanceItem called: ' + id +' bikeId: '+ bikeId);
      router.push( { pathname: '/(home)/(maintenanceItems)', params: { id: ensureString(id), bikeid: ensureString(bikeId) } });
    }

    useEffect(() => {
      syncDescription(maintenanceItem);  // for some reason, this doesn't always trigger.  Maybe tie to item better?
    }, [maintenanceItem]);

    return (
      <Pressable className="w-full" onPress={editMaintenanceItem}>
        <HStack key={"maintenanceItem-" + maintenanceItem.id}>
          <BikePartIcon maintenanceItem={maintenanceItem}/>
          <VStack>
            <Text className="text-lg">{maintenanceItem.part}</Text>
            <Text className="text-sm">{description}</Text>
          </VStack>
        </HStack>
      </Pressable>
    )
  }

  type BikeCompProps = {
    item: BikeMaintenanceListItem;
    bike: Bike;
  };
  const BikeComp: React.FC<BikeCompProps> = ({ item, bike }) => {
    const [description, setDescription ] = useState('');

    const toggleExpanded = () => {
      item.expanded =!item.expanded;
      if (item.expanded) {
        setExpandedBike(bike.id);
      } else {
        setExpandedBike(0);
      }
      resetList();
    }

    const syncDescription = async () => {
      const pref = await preferences;
      const val = metersToDisplayString(bike.odometerMeters, pref) + ' ' + pref.units;
      setDescription(val);
    }
    useEffect(() => {
      syncDescription();
    }, []);

    return (
      <Pressable className="row-primary w-full" onPress={toggleExpanded} >
        <HStack className="w-full" key={"bike-" + bike.id}>
          <BikeIcon size="48"/>
          <VStack>
            <Text className='text-xl' >{bike.name}</Text>
            <Text>{description}</Text>
          </VStack>
          <Pressable className="absolute top-0 right-0" onPress={toggleExpanded} >
            {item.expanded ?
              <ChevronUpIcon className="absolute top-0 right-0" size="48"/>
              : <ChevronDownIcon size="48"/>}
          </Pressable>
        </HStack>
      </Pressable>
    )
  }

  type BikeOrMaintenanceItemProps = {
    item: BikeMaintenanceListItem;
  };
  const BikeOrMaintenanceItem: React.FC<BikeOrMaintenanceItemProps> = ({ item }) => {
    if (item.maintenanceItem) {
      return <MaintenanceItemComp maintenanceItem={item.maintenanceItem} item={item} />;
    }
    if (item.bike) {
      return <BikeComp item={item} bike={item.bike}/>;
    }
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
    const part = maintenanceItem.part;
    if (part === "Chain") {
      return (
        <Link2Icon size="24"/>
      );
    }
    if (part === "Front Shifter Cable" || part === "Rear Shifter Cable") {
      return <CableIcon size="24"/>
    }
    if (part === "Cassette") {
      return (<CogIcon size="24"/>);
    }
    if (part === "Front Tire" || part === "Rear Tire") {
      return (<CircleDotDashedIcon size="24"/>);
    }
    if (part === "Front Brake Pads" || part === "Rear Brake Pads") {
      return (<OctagonMinusIcon size="24"/>);
    }
    if (part.match("Battery")) {
      return (<BatteryChargingIcon size="24"/>);
    }
    if (part.match("Crankset")) {
      return (<CircleSlash2Icon size="24"/>);
    }
    if (part.match("Seal")) {
      return <SprayCanIcon size="24"/>;
    }
    return (
      <BikeIcon size="24"/>
    );
  };

  const updateSorting = (newSortValue: string | undefined) => {
    const newSort = newSortValue ? newSortValue : 'A-Z';
    setSortOption(newSort);
    resetListItems(data, newSort);
  }

  const resetList = async () => {
    resetListItems(data, sortOption);
  }

  const resetListItems = (bikes: Bike[] | null, sortOption: string) => {
    if (!bikes) return;
    setListItems(getSortedItems(bikes, sortOption));
  }

  const getItemForBike = (bike: Bike): BikeMaintenanceListItem => {
    if (bikeItemsMap.has(bike.id)) {
      return bikeItemsMap.get(bike.id)!;
    }
    const newBikeItem: BikeMaintenanceListItem = { bike: bike, maintenanceItem: null, expanded: true, key: "bikeItem-" + bike.id};
    bikeItemsMap.set(bike.id, newBikeItem);
    return newBikeItem;
  }

  const getSortedItems = (bikes: Bike[], sortBy: string): BikeMaintenanceListItem[] => {
    var sortedItems: BikeMaintenanceListItem[] = [];
    const sortedBikes = getSortedBikes(bikes, sortBy);
    for (const bike of sortedBikes) {
      const bikeItem = getItemForBike(bike);
      sortedItems.push(bikeItem);
      if (bikeItem.expanded) {
        for (const maintenanceItem of sortItems(bike.maintenanceItems, sortBy)) {
          sortedItems.push({ bike: bike, maintenanceItem: maintenanceItem, expanded: false, key: "maintenanceItem-" + maintenanceItem.id });
        }
      }
    }
    return sortedItems;
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
    resetListItems(data, sortOption);
  }, [data, isFocused]);

  if (isFetching) {
    return (
      <SafeAreaView className="w-full h-full">
        <Spinner/>
      </SafeAreaView>
    )
  }
  if (!data || data.length === 0) {
    return (
      <SafeAreaView className="w-full h-full">
        <VStack className="w-full h-full">
          <Text>
            No bikes found. Add a bike or sync with Strava.
          </Text>
          <Button
            className="bottom-button shadow-md rounded-lg m-1"
            action="primary"
            onPress={ refresh }
            style={{flex: 1}}
            accessibilityLabel="Refresh list"
            accessibilityHint="Will check for new list items">
            <ButtonText>Refresh</ButtonText>
          </Button>
        </VStack>
      </SafeAreaView>
    )
  } else if (error) {
    return (
      <Text>
        An error occured!
      </Text>
    )
  }
  return (
    <SafeAreaView className="w-full h-full bottom-1">
      <VStack className="w-full h-full">
        <HStack className="w-full flex justify-between">
          <Text className="center-y">Sort by:</Text>
          <View style={{justifyContent: "center",width: "50%"}}>
            <Dropdown
              value={sortOption}
              options={sortOptions}
              onSelect={updateSorting}/>
          </View>
        </HStack>
        <ScrollView
          className="w-full h-full"
          contentContainerStyle={{ flexGrow: 1 }}>
        <VStack className="w-full h-full">
          {listItems.map(bmListItem => (
            <BikeOrMaintenanceItem key={bmListItem.key} item={bmListItem}/>
          ))}
        </VStack>
        </ScrollView>
        <HStack className="w-full flex bg-background-0 flex-grow justify-center">
          <Button
            className="bottom-button shadow-md rounded-lg m-1"
            action="primary"
            onPress={ addMaintenanceItem }
            style={{flex: 1}}
            accessibilityLabel="Add Maintenance Item"
            accessibilityHint="Opens page for adding a maintenance item">
            <ButtonText>Add Maintenance Item</ButtonText>
          </Button>
          <Button
              className="bottom-button shadow-md rounded-lg m-1"
              onPress={ logMaintenance }
              style={{flex: 1}}
              accessibilityLabel="Log Maintenance"
              accessibilityHint="Opens page for logging maintenance">
              <ButtonText>Log Maintenance</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  )
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
  if (!bikes || bikes.length < 1) return [];
  if (sortBy === 'A-Z') {
    console.log('sort by A-Z sorting bikes');
    return bikes.sort((a, b) => compareName(a, b));
  }
  return bikes.sort((a, b) => soonestDue(b) - soonestDue(a));
}

const compareName = (a: Bike, b: Bike): number => {
  // console.log('a.name:', a.name, 'b.name:', b.name);
  // console.log(a.name.localeCompare(b.name));
  if (a.name && b.name) {
    return a.name.localeCompare(b.name);
  }
  return 0;
}

const soonestDue = (bike: Bike): number => {
  var smallest = 100000;
  for (const item of bike.maintenanceItems) {
    try {
      const overdue = bike.odometerMeters - item.dueDistanceMeters;
      smallest = Math.min(smallest, overdue);
    } catch (error) {
      console.log('Error calculating overdue:', error);
    }
  }
  return smallest;
}

export default MaintenanceComponent;
