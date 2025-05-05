import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router } from "expo-router";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, isMobile, isMobileSize, metersToDisplayString, milesToMeters, today } from "@/common/utils";
import MaintenanceItemController from "./MaintenanceItemController";
import { MaintenanceLog } from "@/models/MaintenanceLog";
import { Dimensions, ScrollView, View, StyleSheet } from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "../ui/checkbox";
import { CheckIcon } from "lucide-react-native";
import { Input, InputField } from "../ui/input";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Divider } from "../ui/divider";

type BulkAddMaintenanceProps = {
  maintenanceLogs: MaintenanceLog[],
  markDirty: () => void;
};

const BulkAddMaintenanceComponent: React.FC<BulkAddMaintenanceProps> = ({maintenanceLogs, markDirty}) => {
  const session = useSession();
  const appContext = useGlobalContext();
  const email = session.email ? session.email : '';

  const [bikeIdString, setBikeIdString] = useState('0');
  const [checkedIds, setCheckedIds] = useState([0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const controller = new MaintenanceItemController(appContext);
  const preferences = controller.getUserPreferences(session);

  const dimensions = Dimensions.get('window');
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

  const toggleSelectAll = () => {
    if (selectAll) {  // was checked all now uncheck all
      maintenanceLogs.forEach(log => log.selected = false);
      setSelectAll(false);
    } else {  // was unchecked all now check all
      maintenanceLogs.forEach(log => log.selected = true);
      setSelectAll(true);
    }
  }

  const selectTopEight = () => {
    console.log('selectTopEight', maintenanceLogs);
    var addedCount = 0;
    for (const log of maintenanceLogs) {
      if (addedCount++ < 8) {
        console.log('selectTopEight: ', log);
        log.selected = true;
      }
    }
  }

  const createMaintenanceItems = async (bike: Bike) => {
    setErrorMessage('');
    const selectedItems = maintenanceLogs.filter(log => checkedIds.includes(log.id) && log.bikeId === bike.id);

    const result = await controller.updateOrCreateMaintenanceItems(session, selectedItems);
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
    const [selected, setSelected] = useState(log.selected);

    const toggleSelectedRow = () => {
      log.selected =!log.selected;
      setSelected(log.selected);
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
      log.selected = true;
      setSelected(true);
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

    useEffect(() => {
      setSelected(log.selected);
    }, [log]);

    return (
      <View style={{flex: 1, flexDirection: "row", marginLeft: 1, marginRight: 1}}>
        <View style={proportionStyle.checkBox}>
          <Checkbox size="md"
              value="Not Sure"
              isChecked={selected}
              onChange={toggleSelectedRow}
              accessibilityLabel="Include Maintenance Item">
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
        </View>
        <View style={proportionStyle.part}>
          <Pressable onPress={toggleSelectedRow}>
            <Text key={"prt" + rowKey}>{log.maintenanceItem.part}</Text>
          </Pressable>
        </View>
        <View style={proportionStyle.action}>
          <Pressable onPress={toggleSelectedRow}>
            <Text key={"act" + rowKey}>{log.maintenanceItem.action}</Text>
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
      <VStack className="w-full">
        <HStack>
          <VStack style={proportionStyle.checkBox}>
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
              <Text>Due At</Text>
            </VStack>
          )}
        </HStack>
      </VStack>
    );
  }

  const rowKeyFor = (log: MaintenanceLog): string => {
    return log.id.toString() + log.maintenanceItem.part + log.maintenanceItem.action;
  }

  useEffect(() => {
     selectTopEight();
  }, [maintenanceLogs]);

  return (
    <VStack className="w-full h-full justify-start">
      <MaintenanceLogHeader />
      <Divider className="w-full"/>
      <ScrollView className="w-full">
        {maintenanceLogs.map((log) =>
          <MaintenanceLogRow log={log} rowKey={"mlr" + rowKeyFor(log)} key={"mlr" + rowKeyFor(log)}/>
        )}
      </ScrollView>
    </VStack>
  )
};

export default BulkAddMaintenanceComponent;
