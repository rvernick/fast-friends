import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Button, Text, Surface, Checkbox, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { useSession } from "@/ctx";
import { ensureString, isMobile, metersToMilesString, milesToMeters } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MaintenanceItemController from "./MaintenanceItemController";
import { MaintenanceItem, Part } from "@/models/MaintenanceItem";
import { FlatList, View } from "react-native";
import { LogMaintenanceController } from "./LogMaintenanceController";

const threeThousandMilesInMeters = milesToMeters(3000);

const newMaintenanceItem = {
  id: 0,
  part: '',
  name: '',
  brand: 'Shimano',
  model: '',
  link: '',
  bikeDistance: 0,
  dueDistanceMeters: threeThousandMilesInMeters,
};

const newBike = {
  id: 0,
  name: '',
  type: 'Road',
  groupsetSpeed: 11,
  groupsetBrand: 'Shimano',
  isElectronic: false,
  odometerMeters: 0,
  maintenanceItems: [],
  stravaId: '',
}

const LogMaintenanceComponent = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();
  const router = useNavigation();
  const email = session.email ? session.email : '';
  const searchParams = useLocalSearchParams();
  
  const maintenanceId = searchParams.maintenanceid? parseInt(ensureString(searchParams.maintenanceid)) : 0;
  const initialBikeId = searchParams.bikeid? ensureString(searchParams.bikeid): '0';
  
  const [isNew, setIsNew] = useState(maintenanceId === 0);
  const [bike, setBike] = useState<Bike>(newBike);
  const [bikeName, setBikeName] = useState('Select Bike');
  const [bikeIdString, setBikeIdString] = useState(initialBikeId);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [checkedIds, setCheckedIds] = useState([0]);
  const [nextDue, setNextDue] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);

  const controller = new MaintenanceItemController(appContext);

  const useStyle = isMobile
  const { data: bikes } = useQuery({
    queryKey: ['bikes'],
    initialData: [],
    queryFn: () => controller.getBikes(session, email),
  });


  const selectBike = (idString: string | undefined) => {
    if (idString) {
      const id = parseInt(idString);
      const bikeById = bikes.find(bike => bike.id === id);
      if (bikeById) {
        console.log('Selected bike id: ', id);
        setBike(bikeById);
        setBikeName(bikeById.name + ": " + metersToMilesString(bikeById.odometerMeters));
        setBikeIdString(idString);
        setCheckedIds([]);
        console.log('Selected bikeById id: ', id);
      } else {
        console.log('Bike not found: ', idString);
      }
    }
  }

  const createMaintenanceLogs = () => {
    console.log('createMaintenanceLogs');
    for (const bike of bikes) {
      for (const item of bike.maintenanceItems) {
        var log = {
          id: item.id,
          bikeId: bike.id,
          maintenanceItem: item,
          nextDue: bike.odometerMeters + item.defaultLongevity,
          selected: false,
        };
        maintenanceLogs.push(log);
      }
    }
  }

  const reset = () => {
    try {
      console.log('useEffect initialize maintenance item: ', maintenanceId);
      controller.getMaintenanceItem(session, maintenanceId, email, appContext).then(item => {
        if (item != null) {
          setIsInitialized(true);
        }
      });
    } catch (error) {
      console.error('Error initializing maintenance item: ', error);
    }
  };

  const selectDefaultBike = () => {
    const roomForMore = Object.keys(Part).length;
    const defaultBike = bikes.find((bike) => !bike.maintenanceItems || bike.maintenanceItems.length < roomForMore);
    if (defaultBike) {
      selectBike(ensureString(defaultBike.id));
    } else {
      console.log('No default bike found');
      selectBike(ensureString(bikes[0].id));
    }
  }

  const submitMaintenance = () => {
    console.log('submitMaintenance');
    const selectedItems = maintenanceLogs.filter(log => log.selected && log.bikeId === bike.id);
    controller.logMaintenance(session, selectedItems);
  }

  type MaintenanceLogRowProps = {
    log: MaintenanceLog;
  };

const MaintenanceLogRow: React.FC<MaintenanceLogRowProps> = ({ log }) => {
  const [nextDueValue, setNextDueValue] = useState(metersToMilesString(log.nextDue));

  const toggleSelectedRow = () => {    
    if (checkedIds.includes(log.id)) {
      log.selected = false;
      setCheckedIds((prevIds) => prevIds.filter((id) => id!== log.id));
    } else {
      setCheckedIds((prevIds) => [...prevIds, log.id]);
      log.selected = true;
    }
  }

  const setNextDue = (newValue: string) => {
    try {
      if (newValue.match(/^[0-9]*$/)) {
        const nextDueDistanceMiles = parseInt(newValue);
        const nextDueDistanceMeters = milesToMeters(nextDueDistanceMiles);
        setNextDueValue(newValue);
        log.nextDue = nextDueDistanceMeters;
      }
    } catch (error) {
      console.error('Error setting next due: ', error);
    }
  }

  const ensureSelected = () => {
    if (!checkedIds.includes(log.id)) {
      setCheckedIds((prevIds) => [...prevIds, log.id]);
    }
  }

  return (
    <View style={{width: "100%", flexDirection: "row", marginLeft: 1, marginRight: 1}}>
      <View style={{ width: "10%", padding: 10}}>
        <Checkbox status={checkedIds.includes(log.id) ? 'checked' : 'unchecked'}
          onPress={toggleSelectedRow}/>
      </View>
      <View style={{ width: "30%", padding: 10}}>
        <Text onPress={toggleSelectedRow}>{log.maintenanceItem.part}</Text>
      </View>
      <View style={{width: "30%"}}>
        <Text onPress={toggleSelectedRow}>{' Due: ' + metersToMilesString(log.maintenanceItem.dueDistanceMeters)}</Text>
      </View>
      <View style={{ width: "30%", padding: 10}}>
        <TextInput
          onChangeText={(newValue) => {setNextDue(newValue)}}
          value={ nextDueValue }
          onBlur={ensureSelected}
        />
      </View>
    </View>
  )
};

/** Working, but can't edit the text field
 * 
 *     <TouchableRipple style={{width: "100%", flexDirection: "row", marginLeft: 1, marginRight: 1}} onPress={toggleSelectedRow}>
      <View style={{ width: "100%", flexDirection: "row"}}>
      <View style={{ width: "10%", padding: 10}}>
        
        <Checkbox status={checkedIds.includes(item.id) ? 'checked' : 'unchecked'}
          onPress={toggleSelectedRow}/>
      </View>
      <View style={{ width: "30%", padding: 10}}>
        <Text >{item.part}</Text>
      </View>
      <View style={{width: "30%", alignItems: "stretch"}}>
        <Text >{' Due: ' + metersToMilesString(item.dueDistanceMeters)}</Text>
      </View>
      <View style={{ width: "30%", padding: 10}}>
        <TextInput value="help" ></TextInput>
        </View>
      </View>
    </TouchableRipple>

 * 
 */


/**
 *     <TouchableRipple style={{width: "100%", flexDirection: "row", marginLeft: 1, marginRight: 1}} onPress={toggleSelectedRow}>
      <Card style={{width: "100%", flexDirection: "row", marginLeft: 1, marginRight: 1, alignItems: "stretch"}}>
        <Card.Content style={{width: "100%", flexDirection: "row", alignItems: "stretch", marginRight: 1}}>
        <Checkbox status={checkedIds.includes(item.id) ? 'checked' : 'unchecked'}
          onPress={toggleSelectedRow}/>
        <Text style={{width: '30%'}}>{item.part}</Text>
        <Text style={{width: '30%', flex: 0.3}}>{' Due: ' + metersToMilesString(item.dueDistanceMeters)}</Text>
        <TextInput style={{width: '30%', marginRight: 1}}>{item.name}</TextInput>
        </Card.Content>
      </Card>
    </TouchableRipple>
 */
  useEffect(() => {
    if (checkedIds.includes(0)) {
      setCheckedIds(checkedIds.filter(id => id!== 0));
    }
    try {
      console.log('useEffect initialize bike: ', bikes.length);
      if (!isInitialized && bikes.length > 0) {
        if (isNew) {
          createMaintenanceLogs();
          selectDefaultBike();
          setIsInitialized(true);
        } else {
          reset();
        }
      }
    } catch (error) {
      console.error('Error initializing maintenance item: ', error);
    }
  }, [bikes]);
  
  // const groupsetOptions = groupsetBrands.map(brand => ({ label: brand, value: brand }));
  // const speedOptions = groupsetSpeeds.map(speed => ({ label: speed, value: speed}));
  // const typeOptions = types.map(type => ({ label: type, value: type }));


  useEffect(() => {
    router.setOptions({ title: bikeName });
  }), [bikeName];

  return (
    <Surface>
      {bikes && bikes.length > 1 ? <BikeDropdown
        bikes={bikes}
        value={bikeIdString}
        readonly={false}
        onSelect={selectBike} /> : <Text>{bikeName}</Text>}
      <FlatList
        data={maintenanceLogs.filter(log => log.bikeId === bike.id)}
        renderItem={({item}) => <MaintenanceLogRow log={item} />}
        keyExtractor={item => item.id.toFixed(0)}
      />
      <Surface style={{flexDirection: 'row', justifyContent:'space-between', padding: 16 }}>
        <Button
          style={{flex: 1}}
          mode="contained"
          onPress={() => router.goBack()}>
            Cancel
        </Button>
        <Button
          style={{flex: 1}}
          mode="contained"
          disabled={checkedIds.length < 1}
          onPress={submitMaintenance}>
            Mark Done
        </Button>
      </Surface>

    </Surface>
  )
};



type BikeDropdownProps = {
  bikes: Bike[] | null | undefined;
  value: string;
  readonly: boolean;
  onSelect: (value: string) => void;
};

export const BikeDropdown: React.FC<BikeDropdownProps> = ({ bikes, value, readonly, onSelect }) => {
  if (!bikes || bikes == null || bikes.length == 0) return null;
  if (!bikes) return null;
  // console.log('BikeDropdown bikes: ', bikes);
  // console.log('BikeDropdown bikes: ', JSON.stringify(bikes));
  const bikeOptions = bikes?.map(bike => ({ label: bike.name, value: ensureString(bike.id) }));
  // console.log('BikeDropdown set: ', value);
  // console.log('BikeDropdown options: ', JSON.stringify(bikeOptions));
  return (
    <Dropdown
        disabled={readonly}
        label="Bike"
        placeholder={ensureString(value)}
        options={bikeOptions}
        value={ensureString(value)}
        onSelect={(value) => onSelect(ensureString(value))}
      />
  )
};

interface MaintenanceLog {
  id: number;
  bikeId: number;
  maintenanceItem: MaintenanceItem;
  nextDue: number;
  selected: boolean;
}

export default LogMaintenanceComponent;
