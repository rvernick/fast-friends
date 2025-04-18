import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useNavigation } from "expo-router";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, isMobile, isMobileSize, metersToDisplayString, milesToMeters, today } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MaintenanceItemController from "./MaintenanceItemController";
import { Part } from "@/models/MaintenanceItem";
import { MaintenanceLog } from "@/models/MaintenanceLog";
import { Dimensions, ScrollView, View, StyleSheet } from "react-native";
import { createStyles, defaultWebStyles } from "@/common/styles";
import { DatePickerInput } from "react-native-paper-dates";
import { defaultMaintenanceItems } from "./default-maintenance";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "../ui/checkbox";
import { CheckIcon, SquareCheck } from "lucide-react-native";
import { Input, InputField } from "../ui/input";
import { Button, ButtonIcon } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";

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

type BulkAddMaintenanceProps = {
  bike: Bike,
  markDirty: () => void;
};

const BulkAddMaintenanceComponent: React.FC<BulkAddMaintenanceProps> = ({bike, markDirty}) => {
  const session = useSession();
  const appContext = useGlobalContext();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const email = session.email ? session.email : '';
  
  const [bikeIdString, setBikeIdString] = useState('0');
  const [checkedIds, setCheckedIds] = useState([0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [logsCreatedFor, setLogsCreatedFor] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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

  const syncBike = async (aBike: Bike) => {
    if (aBike) {
      console.log('Selected bike id: ', aBike.id);
      setBikeIdString(aBike.id.toString());
      selectTopEight(aBike);
      setErrorMessage('');
      console.log('Selected bikeById id: ', aBike.id);
    } else {
      console.log('Bike not found: ', aBike);
    }
  }

  const skip = () => {
    router.replace('/(home)/maintenance');
  }

  const toggleSelectAll = () => {
    if (selectAll) {  // was checked all now uncheck all
      setCheckedIds([]);
      maintenanceLogs.forEach(log => log.selected = false);
    } else {  // was unchecked all now check all
      maintenanceLogs.forEach(log => log.selected = true);
      setCheckedIds(maintenanceLogs.map(log => log.id));
    }
    setSelectAll(!selectAll);
  }

  const selectTopEight = (bike: Bike) => {
    console.log('selectTopEight', maintenanceLogs);
    const newCheckedIds = [];
    var addedCount = 0;
    for (const log of maintenanceLogs) {
      if (addedCount++ < 8) {
        console.log('selectTopEight: ', log);
        newCheckedIds.push(log.id);
      }
    }
    setCheckedIds(newCheckedIds);
  }

  const ensureMaintenanceLogs = (aBike: Bike) => {
    console.log('ensureMaintenanceLogs');
    if (logsCreatedFor.includes(aBike.id)) {
      return;
    }
    logsCreatedFor.push(aBike.id);
    var logId = 1;
    for (const item of defaultMaintenanceItems(aBike)) {
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

    setMaintenanceLogs(maintenanceLogs);
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
          <Checkbox size="md"
              value="Not Sure"
              isChecked={log.selected}
              onChange={toggleSelectedRow}
              accessibilityLabel="Include Maintenance Item"> 
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
        </View>
        <View style={proportionStyle.part}>
          <Pressable onPress={toggleSelectedRow}>
            <Text key={"prt" + rowKey} onPress={toggleSelectedRow}>{log.maintenanceItem.part}</Text>
          </Pressable>
        </View>
        <View style={proportionStyle.action}>
          <Pressable onPress={toggleSelectedRow}>
            <Text key={"act" + rowKey} onPress={toggleSelectedRow}>{log.maintenanceItem.action}</Text>
          </Pressable>
        </View>

        <View style={proportionStyle.doEvery}>
          <Input
            size="md"
            isDisabled={false}
            isInvalid={false}
          >
            <InputField 
              autoComplete="off"
              value={doEveryString}
              onChangeText={(newValue) => {setDoEvery(newValue)}}
              onBlur={ensureSelected}
              placeholder="Enter bike name here..." 
              testID="nameInput"
              inputMode="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Do Every"
              accessibilityHint="Distance to do each maintenance"/>
          </Input>
        </View>
        <View style={proportionStyle.unit}>
          <Pressable onPress={toggleSelectedRow}>
            <Text key={"due" + rowKey} onPress={toggleSelectedRow}>
              {unit}</Text>
            </Pressable>
        </View>
        { isMobileSize() ? null : (
          <View style={proportionStyle.nextDue}>
            {log.nextDue ? (
              <Input
            size="md"
            isDisabled={false}
            isInvalid={false}
          >
            <InputField 
              autoComplete="off"
              value={dueString}
              onChangeText={(newValue) => {setNextDueMilage(newValue)}}
              placeholder="Enter bike name here..." 
              testID="nameInput"
              inputMode="numeric"
              onBlur={ensureSelected}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Do Every"
              accessibilityHint="Distance to do each maintenance"/>
          </Input>
              ) : (
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
        <HStack>
          <VStack  style={{justifyContent: "center", width: "15%", padding: 10}}>
            <Checkbox size="md"
              value="Not Sure"
              isChecked={selectAll}
              onChange={toggleSelectAll}
              accessibilityLabel="Include Maintenance Item"> 
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
          </VStack>
          <VStack style={proportionStyle.part}>
            <Text>Part</Text>
          </VStack>
          <VStack style={proportionStyle.action}>
            <Text>Action</Text>
          </VStack>
          <VStack style={proportionStyle.doEvery}>
            <Text>Do Every</Text>
          </VStack>
          <VStack style={proportionStyle.unit}>
            <Text> </Text>
          </VStack>
          { isMobileSize() ? null : (
            <VStack style={proportionStyle.nextDue}>
              <Text>Action</Text>
            </VStack>
          )}
        </HStack>
      );
    // return (
    //   <View style={{flex: 1, flexDirection: "row", marginLeft: 1, marginRight: 1}}>
    //     <View style={{justifyContent: "center", width: "15%", padding: 10}}>
    //       <Button size="lg" className="rounded-full p-3.5" onPress={toggleAll}>
    //         <ButtonIcon as={SquareCheck} />
    //       </Button>
    //     </View>
    //     <View style={proportionStyle.part}>
    //       <Text>Part</Text>
    //     </View>
    //     <View style={proportionStyle.action}>
    //       <Text>Action</Text>
    //     </View>
    //     <View style={proportionStyle.doEvery}>
    //       <Text>Do Every</Text>
    //     </View>
    //     <View style={proportionStyle.unit}>
    //       <Text> </Text>
    //     </View>
    //     { isMobileSize() ? null : (
    //       <View style={proportionStyle.nextDue}>
    //         <Text>Next Due</Text>
    //       </View>
    //     )}
    //   </View>
    // );
  }

  const rowKeyFor = (log: MaintenanceLog): string => {
    return log.id.toString() + log.maintenanceItem.part + log.maintenanceItem.action;
  }

  const toggleAll = () => {
    if (checkedIds.length > 0) {
      setCheckedIds([]);
      maintenanceLogs.forEach((log) => log.selected = false);
    } else {
      const newCheckedIds = [];
      for (const log of maintenanceLogs) {
        if (log.bikeId === bike.id) {
          newCheckedIds.push(log.id);
        }
      }
      maintenanceLogs.forEach((log) => log.selected = true);
      setCheckedIds(newCheckedIds);
    }
  }

  useEffect(() => {
     selectTopEight(bike);
  }, [maintenanceLogs]);

  useEffect(() => {
    ensureMaintenanceLogs(bike);
  }, [bike]);

  return (
    <VStack >
      <MaintenanceLogHeader />
      <ScrollView className="w-full h-full">
        {maintenanceLogs.filter(log => log.bikeId === bike.id).map((log) => 
          <MaintenanceLogRow log={log} rowKey={"mlr" + rowKeyFor(log)} key={"mlr" + rowKeyFor(log)}/>
        )}
      </ScrollView>
    </VStack>
  )
};

export default BulkAddMaintenanceComponent;
