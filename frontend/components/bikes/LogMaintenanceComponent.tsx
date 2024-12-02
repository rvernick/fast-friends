import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Button, Text, Surface, Checkbox, TextInput, Card, Icon, HelperText } from "react-native-paper";
import { useSession } from "@/ctx";
import { displayStringToMeters, ensureString, isMobile, metersToDisplayString, milesToMeters } from "@/common/utils";
import { useQuery } from "@tanstack/react-query";
import MaintenanceItemController from "./MaintenanceItemController";
import { MaintenanceItem, Part } from "@/models/MaintenanceItem";
import { Dimensions, ScrollView, View } from "react-native";
import { createStyles, styles } from "@/common/styles";
import { BikeDropdown } from "../common/BikeDropdown";

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
  isRetired: false,
}
/**
 * 
type MaintenanceItemProps = {
  maintenanceid: number,
  bikeid: number,
};

const MaintenanceItemComponent: React.FC<MaintenanceItemProps> = ({maintenanceid, bikeid}) => {
 */

type LogMaintenanceProps = {
  bikeid: string,
};

const LogMaintenanceComponent: React.FC<LogMaintenanceProps> = ({bikeid}) => {
  const session = useSession();
  const appContext = useGlobalContext();
  const navigation = useNavigation();
  const email = session.email ? session.email : '';
  
  const [bike, setBike] = useState<Bike>(newBike);
  const [bikeName, setBikeName] = useState('Select Bike');
  const [bikeIdString, setBikeIdString] = useState('0');
  const [checkedIds, setCheckedIds] = useState([0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const controller = new MaintenanceItemController(appContext);
  const preferences = controller.getUserPreferences(session);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : styles;

  const { data: bikes } = useQuery({
    queryKey: ['bikes'],
    initialData: [],
    queryFn: () => controller.getCurrentBikes(session, email),
  });

  const selectBike = async (idString: string | undefined) => {
    if (idString && idString !== bikeIdString && bikes) {
      const id = parseInt(idString);
      const bikeById = bikes.find(bike => bike.id === id);
      if (bikeById) {
        console.log('Selected bike id: ', id);
        setBike(bikeById);
        setBikeName(bikeById.name + ": " + metersToDisplayString(bikeById.odometerMeters, await preferences));
        setBikeIdString(idString);
        setCheckedIds([]);
        setErrorMessage('');
        console.log('Selected bikeById id: ', idString);
      } else {
        console.log('Bike not found: ', idString);
      }
    }
  }

  const createMaintenanceLogs = () => {
    console.log('createMaintenanceLogs');
    if (!bikes) {
      return;
    }
    for (const bike of bikes) {
      for (const item of bike.maintenanceItems) {
        var log = {
          id: item.id,
          bikeId: bike.id,
          maintenanceItem: item,
          due: item.dueDistanceMeters,
          nextDue: bike.odometerMeters + item.defaultLongevity,
          selected: false,
        };
        maintenanceLogs.push(log);
      }
    }
    setMaintenanceLogs(maintenanceLogs.sort((a, b) => a.due - b.due));
  }

  const selectDefaultBike = () => {
    if (!bikes) {
      console.log('No bikes found');
      return;
    }
    var defaultBike: Bike | undefined;
    if (bikeid) {
      defaultBike = bikes.find(bike => bike.id === parseInt(bikeid));
    } else {
      const roomForMore = Object.keys(Part).length;
      defaultBike = bikes.find((bike) => !bike.maintenanceItems || bike.maintenanceItems.length < roomForMore);      
    }
    if (defaultBike) {
      selectBike(ensureString(defaultBike.id));
    } else {
      console.log('No default bike found');
      selectBike(ensureString(bikes[0].id));
    }
  }

  const submitMaintenance = async () => {
    setErrorMessage('');
    const selectedItems = maintenanceLogs.filter(log => checkedIds.includes(log.id) && log.bikeId === bike.id);

    console.log('submitMaintenance selected bike: ', bike.name);
    console.log('submitMaintenance selected bike: ', bike.id);
    const result = await controller.logMaintenance(session, selectedItems);
    console.log('submit maintenance result: ', result);
    if (result == '') {
      router.replace({ pathname: '/(home)/(maintenanceItems)/history', params: { bikeId: bike.id }});
    }
  }

  type MaintenanceLogRowProps = {
    log: MaintenanceLog;
    rowKey: string;
  };

  const MaintenanceLogRow: React.FC<MaintenanceLogRowProps> = ({ log, rowKey }) => {
    const [nextDueValue, setNextDueValue] = useState(log.nextDue);
    const [nextDueString, setNextDueString] = useState('0');
    const [dueDistanceString, setDueDistanceString] = useState('0');

    const toggleSelectedRow = () => {    
      if (checkedIds.includes(log.id)) {
        log.selected = false;
        setCheckedIds((prevIds) => prevIds.filter((id) => id!== log.id));
      } else {
        setCheckedIds((prevIds) => [...prevIds, log.id]);
        log.selected = true;
      }
    }

    const setNextDue = async (newValue: string) => {
      try {
        if (newValue.match(/^[0-9]*$/)) {
          const nextDueDistanceMeters = displayStringToMeters(newValue, await preferences);
          setNextDueString(newValue);
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

    const syncNextDueString = async () => {
      setNextDueString(metersToDisplayString(nextDueValue, await preferences));
      setDueDistanceString(metersToDisplayString(log.maintenanceItem.dueDistanceMeters, await preferences));
    }
    
    useEffect(() => {
      syncNextDueString();
    }, [nextDueValue]);

    return (
      <View style={{flex: 1, flexDirection: "row", marginLeft: 1, marginRight: 1}}>
        <View style={{ width: "15%", padding: 10}}>
          <Checkbox key={"cb" + rowKey} status={checkedIds.includes(log.id) ? 'checked' : 'unchecked'}
            onPress={toggleSelectedRow}/>
        </View>
        <View style={{justifyContent: "center", width: "20%", padding: 10}}>
          <Text key={"prt" + rowKey} onPress={toggleSelectedRow}>{log.maintenanceItem.part}</Text>
        </View>
        <View style={{justifyContent: "center", width: "18%", padding: 10}}>
          <Text key={"act" + rowKey} onPress={toggleSelectedRow}>{log.maintenanceItem.action}</Text>
        </View>
        <View style={{ justifyContent: "center", width: "23%"}}>
          <Text key={"due" + rowKey} onPress={toggleSelectedRow}>
            {dueDistanceString}</Text>
        </View>
        <View style={{ justifyContent: "center", width: "24%", padding: 10}}>
          <TextInput
            onChangeText={(newValue) => {setNextDue(newValue)}}
            value={ nextDueString }
            onBlur={ensureSelected}
            key={"nextDue" + rowKey}
          />
        </View>
      </View>
    )
  };

  const MaintenanceLogHeader = () => {
    return (
      <View style={{flex: 1, flexDirection: "row", marginLeft: 1, marginRight: 1}}>
        <View style={{justifyContent: "center", width: "15%", padding: 10}}>
          <Icon source="check" size={24} color="black" />
        </View>
        <View style={{justifyContent: "center", width: "20%", padding: 10, }}>
          <Text>Part</Text>
        </View>
        <View style={{justifyContent: "center", width: "18%", padding: 10, }}>
          <Text>Action</Text>
        </View>
        <View style={{justifyContent: "center",width: "23%"}}>
          <Text>Due</Text>
        </View>
        <View style={{justifyContent: "center", width: "24%", padding: 10}}>
          <Text>Next Due</Text>
        </View>
      </View>
    );
  }

  useEffect(() => {
    if (checkedIds.includes(0)) {
      setCheckedIds(checkedIds.filter(id => id!== 0));
    }
    try {
      if (bikes) {
        console.log('useEffect initialize bike: ', bikes.length);
        if (!isInitialized && bikes.length > 0) {
          createMaintenanceLogs();
          selectDefaultBike();
          setIsInitialized(true);
        }
      }
    } catch (error) {
      console.error('Error initializing maintenance item: ', error);
    }
  }, [bikes]);

  useEffect(() => {
    navigation.setOptions({ title: bikeName });
  }), [bikeName];

  return (
    <Surface style={useStyle.containerScreen}>
      <Card style={useStyle.input} >
        {bikes && bikes.length > 1 ? <BikeDropdown
          bikes={bikes}
          value={bikeIdString}
          readonly={false}
          onSelect={selectBike} /> : <Text>{bikeName}</Text>}
      </Card>
      
      <ScrollView style={useStyle.scrollView}>
        <MaintenanceLogHeader />
        {maintenanceLogs.filter(log => log.bikeId === bike.id).map((log) => 
          <MaintenanceLogRow log={log} rowKey={"mlr" + log.id} key={"mlr" + log.id}/>
        )}
      </ScrollView>
              
      <Surface style={useStyle.bottomButtons}>
        <Button
          style={{flex: 1}}
          mode="contained"
          onPress={() => navigation.goBack()}>
            Cancel
        </Button>
        <Button
          style={{flex: 1}}
          mode="contained"
          onPress={() => {router.push('/(home)/(maintenanceItems)/instructions')}}>
            Instructions
        </Button>
        <Button
          style={{flex: 1}}
          mode="contained"
          disabled={checkedIds.length < 1}
          onPress={submitMaintenance}>
            Mark Done
        </Button>
        <HelperText visible={errorMessage.length > 0} type={"error"}>{errorMessage}</HelperText>
      </Surface>

    </Surface>
  )
};

interface MaintenanceLog {
  id: number;
  bikeId: number;
  maintenanceItem: MaintenanceItem;
  due: number;
  nextDue: number;
  selected: boolean;
}

export default LogMaintenanceComponent;
