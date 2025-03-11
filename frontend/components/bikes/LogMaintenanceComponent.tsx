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
import { Dimensions, ScrollView, View } from "react-native";
import { createStyles, defaultWebStyles } from "@/common/styles";
import { BikeDropdown } from "../common/BikeDropdown";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaView } from "../ui/safe-area-view";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Button, ButtonText } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "../ui/checkbox";
import { Text } from "../ui/text";
import { Input, InputField } from "../ui/input";
import { Icon, CheckIcon } from "../ui/icon";
import { Pressable } from "../ui/pressable";

const threeThousandMilesInMeters = milesToMeters(3000);

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

type LogMaintenanceProps = {
  bikeid: string,
};

const LogMaintenanceComponent: React.FC<LogMaintenanceProps> = ({bikeid}) => {
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

  const controller = new MaintenanceItemController(appContext);
  const preferences = controller.getUserPreferences(session);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles;

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

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(home)/maintenance');
    }
  }

  const createMaintenanceLogs = () => {
    console.log('createMaintenanceLogs');
    if (!bikes) {
      return;
    }
    const logs = [];
    for (const bike of bikes) {
      for (const item of bike.maintenanceItems) {
        const nextDue = item.dueDistanceMeters ? bike.odometerMeters + item.defaultLongevity : null;
        const nextDate = item.dueDate ? new Date(today().getTime() + item.defaultLongevityDays * 24 * 60 * 60 * 1000) : null;
        var log = {
          id: item.id,
          bikeId: bike.id,
          bikeMileage: bike.odometerMeters,
          maintenanceItem: item,
          due: item.dueDistanceMeters,
          nextDue: nextDue,
          nextDate: nextDate,
          selected: false,
        };
        logs.push(log);
      }
    }
    setMaintenanceLogs(logs.sort((a, b) => sortValue(a) - sortValue(b)));
  }

  const sortValue = (mlog: MaintenanceLog): number => {
    try {
      if (mlog.due) {
        return mlog.due;
      }
      if (mlog.nextDate) {
        const milisecondsTillDue = mlog.nextDate?.getTime() - today().getTime();
        const daysTilDue = milisecondsTillDue / (1000 * 60 * 60 * 24);
        const metersTillDue = daysTilDue * 10*1000;
        return metersTillDue + mlog.bikeMileage;  // 10k per day
      }
    } catch (error) {
      console.log('Error sorting maintenance log: ', error);
    }
    return Infinity;
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
    queryClient.removeQueries({ queryKey: ['history'] });

    if (result == '') {
      router.replace({ pathname: '/(home)/(maintenanceHistory)/history', params: { bikeId: bike.id }});
    }
  }

  type MaintenanceLogRowProps = {
    log: MaintenanceLog;
    rowKey: string;
  };

  const MaintenanceLogRow: React.FC<MaintenanceLogRowProps> = ({ log, rowKey }) => {
    const [nextDueValue, setNextDueValue] = useState(log.nextDue);
    const [nextDueDate, setNextDueDate] = useState(log.nextDate);
    const [nextDueString, setNextDueString] = useState('0');
    const [dueDistanceString, setDueDistanceString] = useState('0');
    const [selected, setSelected] = useState(log.selected);

    const toggleSelectedRow = () => {    
      if (checkedIds.includes(log.id)) {
        log.selected = false;
        setSelected(false);
        setCheckedIds((prevIds) => prevIds.filter((id) => id!== log.id));
      } else {
        setCheckedIds((prevIds) => [...prevIds, log.id]);
        log.selected = true;
        setSelected(true);
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

    const setNextDate = async (newValue: Date) => {
      try {
        if (newValue) {
          console.log('new date date: ', newValue.toLocaleDateString());
          setNextDueDate(newValue);
          log.nextDate = newValue;
        }
      } catch (error) {
        console.error('Error setting next due: ', error);
      }
    }

    const ensureSelected = () => {
      if (!checkedIds.includes(log.id)) {
        toggleSelectedRow();
      }
    }

    const syncNextDueString = async () => {
      setNextDueString(metersToDisplayString(nextDueValue ? nextDueValue : 0, await preferences));
      if (log.maintenanceItem.dueDistanceMeters > 0) {
        setDueDistanceString(metersToDisplayString(log.maintenanceItem.dueDistanceMeters, await preferences));
      } else {
        const dueDate = new Date(log.maintenanceItem.dueDate);
        setDueDistanceString(dueDate? dueDate.toLocaleDateString() : '');
      }
    }
    
    useEffect(() => {
      syncNextDueString();
    }, [nextDueValue]);

    return (
      <HStack>
        <View style={{ width: "15%", padding: 1, justifyContent: "center"}}>
          <Checkbox
              value="check"
              isChecked={selected}
              onChange={toggleSelectedRow}>
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
          </Checkbox>
        </View>
        <View style={{justifyContent: "center", width: "20%", padding: 1}}>
          <Pressable onPress={toggleSelectedRow}>
            <Text key={"prt" + rowKey} >{log.maintenanceItem.part}</Text>
          </Pressable>
        </View>
        <View style={{justifyContent: "center", width: "18%", padding: 1}}>
          <Pressable onPress={toggleSelectedRow}>
            <Text key={"act" + rowKey}>{log.maintenanceItem.action}</Text>
          </Pressable>
        </View>
        <View style={{ justifyContent: "center", width: "23%", padding: 1}}>
          <Pressable onPress={toggleSelectedRow}>
            <Text key={"due" + rowKey}>{dueDistanceString}</Text>
          </Pressable>
        </View>
        <View style={{ justifyContent: "center", width: "24%", padding: 1}}>
          {log.nextDue ? (
            <Input
              variant="outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField 
                keyboardType="number-pad"
                value={nextDueString}
                onChangeText={(newValue) => {setNextDue(newValue)}}
                onBlur={ensureSelected}
                inputMode="numeric"
                autoCapitalize="none"
                autoCorrect={false}/>
            </Input>
          ) : (
            <DatePickerInput
              locale="en"
              validRange={{startDate: today()}}
              disableStatusBarPadding={false}
              value={nextDueDate ? nextDueDate : new Date(today().getTime() + 90 * 24 * 60 * 60 * 1000)}
              onChange={(d) => d instanceof Date ? setNextDate(d) : null}
              inputEnabled={nextDueDate != null}
              inputMode="start"
            />)}
        </View>
      </HStack>
    )
  };

  const MaintenanceLogHeader = () => {
    return (
      <HStack>
          <View style={{justifyContent: "center", width: "15%", padding: 10}}>
          <Icon size="lg" as={CheckIcon} />
        </View>
        <View style={{justifyContent: "center", width: "20%", padding: 10, }}>
          <Text>Part</Text>
        </View>
        <View style={{justifyContent: "center", width: "18%", padding: 10, }}>
          <Text>Action</Text>
        </View>
        <View style={{justifyContent: "center",width: "23%", padding: 10}}>
          <Text>Due</Text>
        </View>
        <View style={{justifyContent: "center", width: "24%", padding: 10}}>
          <Text>Next Due</Text>
        </View>
      </HStack>
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
    <SafeAreaView className="w-full h-full bottom-1">
      <VStack className="w-full h-full">
        {isInitialized ? null : <Spinner size="large" /> }
        <HStack className="w-full flex justify-between">
          <Text className="text-lg font-bold center-y">Bike: </Text>
          <View style={{justifyContent: "center",width: "50%"}}>
            {bikes && bikes.length > 1 ? <BikeDropdown
              bikes={bikes}
              value={bikeIdString}
              readonly={false}
              onSelect={selectBike} /> : <Text>{bikeName}</Text>}
          </View>
        </HStack>
        <MaintenanceLogHeader />
        <ScrollView
          className="w-full h-full"
          contentContainerStyle={{ flexGrow: 1 }}>
          <VStack className="w-full h-full">
            {maintenanceLogs.filter(log => log.bikeId === bike.id).map((log) => 
              <MaintenanceLogRow log={log} rowKey={"mlr" + log.id} key={"mlr" + log.id}/>
            )}
          </VStack>
        </ScrollView>
        <HStack className="w-full flex bg-background-0 flex-grow justify-center">
          <Button 
            className="bottom-button shadow-md rounded-lg m-1"
            action="primary"
            onPress={ goBack }
            style={{flex: 1}}
            accessibilityLabel="Add Maintenance Item"
            accessibilityHint="Opens page for adding a maintenance item">
            <ButtonText>Cancel</ButtonText>
          </Button>
          {isMobileSize() ? null : (
              <Button 
                className="bottom-button shadow-md rounded-lg m-1"
                onPress={ () => {router.push('/(home)/(assistance)/instructions')}}
                style={{flex: 1}}
                accessibilityLabel="Show Instructions"
                accessibilityHint="Go to Instructions page">
                <ButtonText>Instructions</ButtonText>
            </Button>
          )}
          <Button 
              className="bottom-button shadow-md rounded-lg m-1"
              onPress={ submitMaintenance }
              isDisabled={checkedIds.length < 1}
              style={{flex: 1}}
              accessibilityLabel="Mark Maintenance Item as Done"
              accessibilityHint="Maintenace logged and next maintenance will be scheduled">
              <ButtonText>Mark Done</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  )
};

export default LogMaintenanceComponent;
