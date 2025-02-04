import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useNavigation } from "expo-router";
import { Button, Text, Surface, Checkbox, TextInput, Card, HelperText, ActivityIndicator, IconButton } from "react-native-paper";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, isMobile, isMobileSize, metersToDisplayString, milesToMeters, today } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MaintenanceItemController from "./MaintenanceItemController";
import { Part } from "@/models/MaintenanceItem";
import { MaintenanceLog } from "@/models/MaintenanceLog";
import { Dimensions, ScrollView, View, StyleSheet } from "react-native";
import { createStyles, defaultWebStyles } from "@/common/styles";
import { BikeDropdown } from "../common/BikeDropdown";
import { DatePickerInput } from "react-native-paper-dates";
import { defaultMaintenanceItems } from "./default-maintenance";

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

type BulkMaintenanceAddProps = {
  bikeid?: string,
};

const BulkMaintenanceAddComponent: React.FC<BulkMaintenanceAddProps> = ({bikeid}) => {
  const session = useSession();
  const appContext = useGlobalContext();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const email = session.email ? session.email : '';
  
  const [bike, setBike] = useState<Bike>(newBike);
  const [bikeName, setBikeName] = useState('Select Bike');
  const [bikeIdString, setBikeIdString] = useState('0');
  const [checkedIds, setCheckedIds] = useState([0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveLabel, setSaveLabel] = useState('Save & Next Bike');

  const controller = new MaintenanceItemController(appContext);
  const preferences = controller.getUserPreferences(session);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles;
  const largeProportionsStyle = StyleSheet.create({
    checkBox: {width: "15%", padding: 1},
    part: {width: "19%", justifyContent: "center", padding: 1},
    action: {width: "19%", justifyContent: "center", padding: 1},
    doEvery: {width: "19%", justifyContent: "center", padding: 1},
    unit: {width: "9%", justifyContent: "center", padding: 1},
    nextDue: {width: "19%", justifyContent: "center", padding: 1},
  });
  const smallProportionsStyle = StyleSheet.create({
    checkBox: {width: "18%", padding: 1},
    part: {width: "23%", justifyContent: "center", padding: 1},
    action: {width: "23%", justifyContent: "center", padding: 1},
    doEvery: {width: "23%", justifyContent: "center", padding: 1},
    unit: {width: "13%", justifyContent: "center", padding: 1},
    nextDue: {width: "0%", justifyContent: "center", padding: 1},
  });
  const proportionStyle = isMobileSize()? smallProportionsStyle : largeProportionsStyle;

  const { data: bikes } = useQuery({
    queryKey: ['bikes'],
    initialData: [],
    queryFn: () => controller.getCurrentBikes(session, email),
  });

  const selectBike = async (idString: string | undefined) => {
    if (idString && idString !== bikeIdString && bikes) {
      const id = parseInt(idString);
      var isLastBike = true;
      var bikeById: Bike | undefined;
      for (const bike of bikes) {
        if (bike.id === id) {
          bikeById = bike;
        } else {
          if (bikeById) {
            isLastBike = false;
          }
        }
      }
      if (bikeById) {
        console.log('Selected bike id: ', id);
        setBike(bikeById);
        setBikeName(bikeById.name + ": " + metersToDisplayString(bikeById.odometerMeters, await preferences));
        setBikeIdString(idString);
        selectTopEight(bikeById);
        if (isLastBike) {
          setSaveLabel('Save & Finish');
        } else {
          setSaveLabel('Save & Next Bike');
        }
        setErrorMessage('');
        console.log('Selected bikeById id: ', idString);
      } else {
        console.log('Bike not found: ', idString);
      }
    }
  }

  const goToNextBike = () => {
    if (!bikes || bikes.length === 0) return;
    var bikeMatched = false;
    for (const bike of bikes) {
      if (bikeMatched) {
        selectBike(ensureString(bike.id));
        break;
      }
      if (bike.id === parseInt(bikeIdString)) {
        bikeMatched = true;
      }
    }
  }

  const saveAndNext = async () => {
    createMaintenanceItems(bike);

    if (saveLabel === 'Save & Next Bike') {
      goToNextBike();
    } else {
      queryClient.removeQueries({ queryKey: ['bikes'] });
      goBack();
    }
  }

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(home)/maintenance');
    }
  }

  const selectTopEight = (bike: Bike) => {
    const newCheckedIds = [];
    var addedCount = 0;
    for (const log of maintenanceLogs) {
      if (log.bikeId === bike.id && addedCount++ < 8) {
        newCheckedIds.push(log.id);
      }
    }
    setCheckedIds(newCheckedIds);
  }

  const createMaintenanceLogs = () => {
    console.log('createMaintenanceLogs');
    var logId = 1;
    if (!bikes) {
      return;
    }
    for (const bike of bikes) {
      for (const item of defaultMaintenanceItems(bike)) {
        var log = {
          id: logId++,
          bikeId: bike.id,
          bikeMileage: bike.odometerMeters,
          maintenanceItem: item,
          due: item.dueDistanceMeters,
          nextDue: item.dueDistanceMeters? bike.odometerMeters + item.defaultLongevity : null,
          nextDate: item.dueDate? new Date(today().getTime() + item.defaultLongevityDays * 24 * 60 * 60 * 1000) : null,
          selected: false,
        }
        maintenanceLogs.push(log);
      }
    }

    setMaintenanceLogs(maintenanceLogs);
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

  const createMaintenanceItems = async (bike: Bike) => {
    setErrorMessage('');
    const selectedItems = maintenanceLogs.filter(log => checkedIds.includes(log.id) && log.bikeId === bike.id);

    const result = await controller.createMaintenanceItems(session, selectedItems);
    console.log('submit maintenance result: ', result);
    if (result && result.length > 0) {
      setErrorMessage(result);
    }
  }

  type MaintenanceLogRowProps = {
    log: MaintenanceLog;
    rowKey: string;
  };

  const MaintenanceLogRow: React.FC<MaintenanceLogRowProps> = ({ log, rowKey }) => {
    const [dueValue, setDueValue] = useState(log.nextDue);
    const [dueDate, setDueDate] = useState(log.nextDate);
    const [doEveryString, setDoEveryString] = useState('0');
    const [dueString, setDueString] = useState('0');
    const [unit, setUnit] = useState('miles');

    const toggleSelectedRow = () => {    
      if (checkedIds.includes(log.id)) {
        log.selected = false;
        setCheckedIds((prevIds) => prevIds.filter((id) => id!== log.id));
      } else {
        setCheckedIds((prevIds) => [...prevIds, log.id]);
        log.selected = true;
      }
    }

    const setNextDueMilage = async (newValue: string) => {
      try {
        if (!newValue.match(/^[0-9]*$/)) {
          return;
        }
        const nextDueDistanceMeters = displayStringToMeters(newValue, await preferences);
        log.maintenanceItem.dueDistanceMeters = nextDueDistanceMeters;
        setDueValue(nextDueDistanceMeters);
        setDueString(newValue);
      } catch (error) {
        console.error('Error setting next due: ', error);
      }
    }

    const setNextDate = async (newValue: Date) => {
      try {
        if (newValue) {
          setDueDate(newValue);
          log.nextDate = newValue;
          log.maintenanceItem.dueDate = newValue;
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

    const setDoEvery = async (newValue: string) => {
      try {
        const prefs = await preferences;
        const numberValue = parseInt(newValue);
        if (numberValue > 0) {
          setDoEveryString(newValue);
          
          if (log.maintenanceItem.defaultLongevity > 0) {
            const newLongevity = displayStringToMeters(newValue, prefs);
            log.maintenanceItem.defaultLongevity = newLongevity;
            log.maintenanceItem.dueDistanceMeters = log.bikeMileage + newLongevity;
            setDueValue(log.maintenanceItem.dueDistanceMeters);
            setDueString(metersToDisplayString(log.maintenanceItem.dueDistanceMeters, prefs));
          } else {
            log.maintenanceItem.defaultLongevityDays = numberValue;
            log.maintenanceItem.dueDate = new Date(today().getTime() + numberValue * 24 * 60 * 60 * 1000);
            log.nextDate = log.maintenanceItem.dueDate;
            setDueDate(log.maintenanceItem.dueDate);
          }
        }
      } catch (error) {
        console.error('Error setting doEvery: ', error);
      }
    }

    const syncNextDueString = async () => {
      const prefs = await preferences;
      setDueString(metersToDisplayString(dueValue ? dueValue : 0, prefs));
      if (byMileage()) {
        const longevityString = metersToDisplayString(log.maintenanceItem.defaultLongevity, prefs);
        console.log('syncNextDueString by mileage: ', longevityString);
        setDoEveryString(longevityString);
        setUnit(prefs.units);
      } else {
        setDoEveryString(ensureString(log.maintenanceItem.defaultLongevityDays));
        setUnit('days');
      }
    }

    const byMileage = () => {
      return log.maintenanceItem.defaultLongevity > 0;
    }
    
    useEffect(() => {
      syncNextDueString();
    }, [dueValue]);

    return (
      <View style={{flex: 1, flexDirection: "row", marginLeft: 1, marginRight: 1}}>
        <View style={proportionStyle.checkBox}>
          <Checkbox key={"cb" + rowKey} status={checkedIds.includes(log.id) ? 'checked' : 'unchecked'}
            onPress={toggleSelectedRow}/>
        </View>
        <View style={proportionStyle.part}>
          <Text key={"prt" + rowKey} onPress={toggleSelectedRow}>{log.maintenanceItem.part}</Text>
        </View>
        <View style={proportionStyle.action}>
          <Text key={"act" + rowKey} onPress={toggleSelectedRow}>{log.maintenanceItem.action}</Text>
        </View>

        <View style={proportionStyle.doEvery}>
          <TextInput
            onChangeText={(newValue) => {setDoEvery(newValue)}}
            value={ doEveryString }
            onBlur={ensureSelected}
            inputMode="numeric"
            key={"nextDue" + rowKey}
          />
        </View>
        <View style={proportionStyle.unit}>
          <Text key={"due" + rowKey} onPress={toggleSelectedRow}>
            {unit}</Text>
        </View>
        { isMobileSize() ? null : (
          <View style={proportionStyle.nextDue}>
            {log.nextDue ? (<TextInput
              onChangeText={(newValue) => {setNextDueMilage(newValue)}}
              value={ dueString }
              onBlur={ensureSelected}
              inputMode="numeric"
              key={"nextDue" + rowKey}
            />) : (
              <DatePickerInput
                locale="en"
                validRange={{startDate: today()}}
                disableStatusBarPadding={false}
                value={dueDate ? dueDate : new Date(today().getTime() + 90 * 24 * 60 * 60 * 1000)}
                onChange={(d) => d instanceof Date ? setNextDate(d) : null}
                inputEnabled={dueDate != null}
                inputMode="start"
              />)}
          </View>
        )}
      </View>
    )
  };

  const MaintenanceLogHeader = () => {
    return (
      <View style={{flex: 1, flexDirection: "row", marginLeft: 1, marginRight: 1}}>
        <View style={{justifyContent: "center", width: "15%", padding: 10}}>
          <IconButton icon="check" size={24} iconColor="black" onPress={toggleAll}/>
        </View>
        <View style={proportionStyle.part}>
          <Text>Part</Text>
        </View>
        <View style={proportionStyle.action}>
          <Text>Action</Text>
        </View>
        <View style={proportionStyle.doEvery}>
          <Text>Do Every</Text>
        </View>
        <View style={proportionStyle.unit}>
          <Text> </Text>
        </View>
        { isMobileSize() ? null : (
          <View style={proportionStyle.nextDue}>
            <Text>Next Due</Text>
          </View>
        )}
      </View>
    );
  }

  const rowKeyFor = (log: MaintenanceLog): string => {
    return log.id.toString() + log.maintenanceItem.part + log.maintenanceItem.action;
  }

  const toggleAll = () => {
    if (checkedIds.length > 0) {
      setCheckedIds([]);
    } else {
      const newCheckedIds = [];
      for (const log of maintenanceLogs) {
        if (log.bikeId === bike.id) {
          newCheckedIds.push(log.id);
        }
      }
      setCheckedIds(newCheckedIds);
    }
  }

  useEffect(() => {
    if (checkedIds.includes(0)) {
      setCheckedIds(checkedIds.filter(id => id!== 0));
    }
    try {
      if (bikes) {
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
      {isInitialized ? null : <ActivityIndicator animating={true} size="large" /> }
      <Card style={useStyle.input} >
        {bikes && bikes.length > 1 ? <BikeDropdown
          bikes={bikes}
          value={bikeIdString}
          readonly={true}
          onSelect={selectBike} /> : <Text>{bikeName}</Text>}
      </Card>
      
      <ScrollView style={useStyle.scrollView}>
        <MaintenanceLogHeader />
        {maintenanceLogs.filter(log => log.bikeId === bike.id).map((log) => 
          <MaintenanceLogRow log={log} rowKey={"mlr" + rowKeyFor(log)} key={"mlr" + rowKeyFor(log)}/>
        )}
      </ScrollView>
              
      <Surface style={useStyle.bottomButtons}>
        <Button
          style={{flex: 1}}
          mode="contained"
          onPress={saveAndNext}>
            {saveLabel}
        </Button>
        <Button
          style={{flex: 1}}
          mode="contained"
          onPress={goBack}>
            Skip
        </Button>
        <HelperText visible={errorMessage.length > 0} type={"error"}>{errorMessage}</HelperText>
      </Surface>

    </Surface>
  )
};

export default BulkMaintenanceAddComponent;
