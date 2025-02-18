import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useNavigation } from "expo-router";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, isMobile, metersToDisplayString, milesToMeters, today } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MaintenanceItemController from "./MaintenanceItemController";
import { Action, MaintenanceItem, Part } from "@/models/MaintenanceItem";
import { BikeDropdown } from "../common/BikeDropdown";
import { PartDropdown } from "../common/PartDropdown";
import { ActionDropdown } from "../common/ActionDropdown";
import { Dimensions, Keyboard, ScrollView, View } from "react-native";
import { createStyles, defaultWebStyles } from "@/common/styles";
import { DatePickerInput } from 'react-native-paper-dates';
import { BaseLayout } from "../layouts/base-layout";
import { Text } from "../ui/text";
import { Input, InputField } from "../ui/input";
import { Dropdown } from "../common/Dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Button, ButtonText } from "../ui/button";

const threeThousandMilesInMeters = milesToMeters(3000);

const newMaintenanceItem = {
  id: 0,
  part: '',
  action: '',
  name: '',
  brand: 'Shimano',
  model: '',
  link: '',
  bikeDistance: 0,
  dueDistanceMeters: threeThousandMilesInMeters,
  dueDate: today(),
  defaultLongevity: 3000,
  defaultLongevityDays: 90,
  autoAdjustLongevity: true,
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

type MaintenanceItemProps = {
  maintenanceid: number,
  bikeid: number,
};

const ninetyDays = 90 * 24 * 60 * 60 * 1000;
const fiveYears = 5 * 365 * 24 * 60 * 60 * 1000;

const MaintenanceItemComponent: React.FC<MaintenanceItemProps> = ({maintenanceid, bikeid}) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();
  const navigation = useNavigation();
  const email = session.email ? session.email : '';

  const maintenanceId = maintenanceid ? parseInt(ensureString(maintenanceid)) : 0;
  const initialBikeId = bikeid ? ensureString(bikeid) : '0';

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

  const [isNew, setIsNew] = useState(maintenanceId === 0);
  const [maintenanceItem, setMaintenanceItem] = useState<MaintenanceItem>(newMaintenanceItem);
  const [bike, setBike] = useState<Bike>(newBike);
  const [bikeName, setBikeName] = useState('Select Bike');
  const [bikeIdString, setBikeIdString] = useState(initialBikeId);
  const [readOnly, setReadOnly] = useState(!isNew);
  const [part, setPart] = useState(Part.CHAIN.toString())
  const [action, setAction] = useState(Action.REPLACE.toString());
  const [dueMiles, setDueMiles] = useState('1500');
  const [dueDate, setDueDate] = useState(new Date(today().getTime() + ninetyDays));
  const [dueDateString, setDueDateString] = useState(new Date(today().getTime() + ninetyDays).toLocaleDateString());
  const [dueDateErrorMessage, setDueDateErrorMessage] = useState('');
  const [dueDistanceLabel, setDueDistanceLabel] = useState('Due Distance (miles)');
  const [defaultLongevityLabel, setDefaultLongevityLabel] = useState('Default Longevity (miles)');
  const [brand, setBrand] = useState('Shimano');
  const [model, setModel] = useState('');
  const [link, setLink] = useState('');
  const [defaultLongevity, setDefaultLongevity] = useState('1500');
  const [defaultLongevityDays, setDefaultLongevityDays] = useState('90');
  const [autoAdjustLongevity, setAutoAdjustLongevity] = useState(true);
  const [deleteLabel, setDeleteLabel] = useState('Delete');
  const [errorMessage, setErrorMessage] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState('Keyboard Hidden');
  const [scrollStyle, setScrollStyle] = useState(useStyle);

  const actionOptions = Object.entries(Action).map(([key, val]) => (val));
  const [availabileActions, setAvailableActions] = useState(actionOptions);
  const [isInitialized, setIsInitialized] = useState(false);

  const deadlineOptions = ['Distance', 'Date', 'Both'].map((val) => ({ label: val, value: val }));
  const [deadline, setDeadline] = useState('Distance');
  const controller = new MaintenanceItemController(appContext);
  const preferences = controller.getUserPreferences(session);

  const { data: bikes } = useQuery({
    queryKey: ['bikes'],
    initialData: [],
    queryFn: () => controller.getCurrentBikes(session, email),
  });

  const updateOrAddMaintenanceItem = async function() {
    const newDueDate = deadline == 'Distance' ? null : dueDate;
    const newDueMiles = deadline == 'Date' ? 0 : displayStringToMeters(dueMiles, await preferences);
    const defaultLongevityInDays = defaultLongevity ? parseInt(defaultLongevityDays) : 0;
    const successful = await controller.updateOrAddMaintenanceItem(
      session,
      email,
      maintenanceItem.id,
      bike.id,
      part,
      action,
      newDueMiles,
      newDueDate,
      brand,
      model,
      link,
      displayStringToMeters(defaultLongevity, await preferences),
      defaultLongevityInDays,
      autoAdjustLongevity,
    );
    if (successful) {
      queryClient.refetchQueries({ queryKey: ['bikes'] });
      if (isNew) {
        // don't know the id so can't reset
        navigation.goBack();
      } else {
        reset();
        setReadOnly(true);
      }
    }
  };
 
  const editOrDone = (value: any) => {
    if (!readOnly) {
      updateOrAddMaintenanceItem();
    } else {
      setReadOnly(false);
    }
  }
  
  const deleteMaintenanceItem = async () => {
    if (await controller.deleteMaintenanceItem(session, email, maintenanceItem.id)) {
      bike.maintenanceItems = bike.maintenanceItems.filter(mi => mi.id!== maintenanceItem.id);
      queryClient.removeQueries({ queryKey: ['bikes'] });
      navigation.goBack();
    } else {
      setDeleteLabel('History');
      setErrorMessage('Cannot delete maintenance item with history');
    }
  }

  const goToHistory = () => {
    router.push( { pathname: '/(home)/(maintenanceHistory)/history', params: { bikeId: bikeIdString }});
  }

  const cancel = () => {
    setIsInitialized(false);
    setReadOnly(true);
    reset();
  }

  const resetMaintenanceItem = async (item: MaintenanceItem) => {
    var bike: Bike | null = null;
    if (item) {
      setMaintenanceItem(item);
      if (item.id === 0) {
        setIsNew(true);
        if (bikes) {
          console.log('Reset mi new with: ' + bikes.length);
        }
        if (bikes && bikes.length > 0) {
          const latestBike = bikes[bikes.length - 1];
          bike = await selectBike(ensureString(latestBike.id));
        }
      } else {
        setIsNew(false);
        if (bikes) {
          for (const bikeItem of bikes) {
//            console.log('Reset checking bikeItems: ', JSON.stringify(bikeItem));
            if (bikeItem.maintenanceItems.some(mi => mi.id === item.id)) {
              bike = await selectBike(ensureString(bikeItem.id));
            }
          }
        }
      }
      
      setPart(ensureString(item.part.toString()));
      setAction(ensureString(item.action.toString()));
      if (item.dueDistanceMeters  && item.dueDistanceMeters> 0) {
        setDueMiles(metersToDisplayString(item.dueDistanceMeters, await preferences));
      } else {
        if (bike) {
          setDueMiles(metersToDisplayString(bike.odometerMeters + item.defaultLongevity, await preferences));
        }
      }
      setBrand(ensureString(item.brand));
      setModel(ensureString(item.model));
      setLink(ensureString(item.link));
      setDefaultLongevity(metersToDisplayString(item.defaultLongevity, await preferences));
      if (item.defaultLongevityDays && item.defaultLongevityDays < 10000) {
        setDefaultLongevityDays(ensureString(item.defaultLongevityDays));
      } else {
        setDefaultLongevityDays('90');
      }
      setAutoAdjustLongevity(item.autoAdjustLongevity);
      if (item.dueDate == null) {
        const newDueDate = today().getTime() + ninetyDays;
        setDueDate(new Date(newDueDate));
        setDeadline('Distance');
      } else {
        setDueDate(new Date(item.dueDate));
        if (item.dueDistanceMeters && item.dueDistanceMeters > 0) {
          setDeadline('Both');
        } else {
          setDeadline('Date');
        }
      }
      console.log('Reset maintenance item: ', item.id );
      // console.log('Reset bike: ', bikes.length );
    }
  }


  // if MI is already set, then we don't need to update the parts or actions list  They should be read-only
  const updateActionsList = (bike: Bike, selectedPart: string) => {
    if (!isNew) return;

    const unusedActions = getUnusedActions(bike, selectedPart);
    const actionOptions = unusedActions.map(act => ({ label: act, value: act }))
    setAvailableActions(unusedActions);
    // console.log('Unused actions for part: ', selectedPart, JSON.stringify(unusedActions));
    // console.log('All actions: ' + JSON.stringify(Action));
    // console.log('current action for part: ', action);
    // console.log('Action options: ', Object.values(unusedActions));
    const unusedActionNames = unusedActions.map(act => act.toString());
    if (!Object.values(unusedActionNames).includes(action)) {
      if (unusedActions.length > 0) {
        // console.log('Setting default action: ', unusedActions[0]);
        setAction(unusedActions[0]);
      } else {
        setAction('');
      }
    }
  }

  const getUnusedActions = (bike: Bike, selectedPart: string) => {
    const allMaintenanceItems = bike.maintenanceItems.filter(mi => mi.id!== maintenanceId);
    // console.log('All maintenance items: ', JSON.stringify(allMaintenanceItems));
    const maintenanceItemsForPart = allMaintenanceItems.filter(mi => mi.part === selectedPart);
    // console.log('Maintenance items for part: ', JSON.stringify(maintenanceItemsForPart));
    for (const mi of maintenanceItemsForPart) {
      // console.log('MI action: ', JSON.stringify(mi));
      // console.log('MI due miles: ', mi.action);
    }
    const usedActions = maintenanceItemsForPart.map(mi => mi.action);
    console.log('Used actions: ', usedActions);
    const result = [];
    for (const action of Object.values(Action)) {
      // console.log('comparing : ', action);
      if (!usedActions.includes(action)) {
        result.push(action);
      }
    } 
    return result;
  }


  const selectBike = async (idString: string | undefined): Promise<Bike | null> => {
    if (idString && bikes) {
      const id = parseInt(idString);
      const bikeById = bikes.find(bike => bike.id === id);
      if (bikeById) {
        console.log('Selected bike idString: ', idString);
        setBike(bikeById);
        const prefs = await preferences;
        const name = isMobile() && bikeById.name.length > 9 ? bikeById.name.substring(0, 8) + "..." : bikeById.name;
        const title = name + ' (' + metersToDisplayString(bikeById.odometerMeters, prefs) +' ' + prefs.units + ')'
        setBikeName(title);
        setBikeIdString(idString);
        // updatePartsList(bikeById);
        updateActionsList(bikeById, part);
        ensureDueMilageAhead(bikeById);
        console.log('Selected bikeById id: ', id);
        return bikeById;
      } else {
        console.log('Bike not found: ', idString);
      }
    }
    return null;
  }

  const ensureDueMilageAhead = async (toBike: Bike) => {
    if (!isNew && readOnly) return;

    const currentMeters = toBike.odometerMeters;
    const nextDueMeters = displayStringToMeters(dueMiles, await preferences);
    if (currentMeters  > nextDueMeters) {
      const forwardMeters = currentMeters + milesToMeters(1500);
      setDueMiles(metersToDisplayString(forwardMeters, await preferences));
    }
  };

  const reset = () => {
    try {
      // console.log('useEffect initialize maintenance item: ', maintenanceId);
      updateLabels();
      controller.getMaintenanceItem(session, maintenanceId, email).then(item => {
        if (item != null) {
          resetMaintenanceItem(item);
          setIsInitialized(true);
          setDueDateErrorMessage('');
        }
      });
    } catch (error) {
      console.error('Error initializing maintenance item: ', error);
    }
  };

  const selectDefaultBike = () => {
    if (!bikes || bikes.length === 0) return;
   
    const defaultBike = bikes[0];
    selectBike(ensureString(defaultBike.id));
  }

  const updateLabels = async () => {
    const pref = await preferences;
    const units = pref.units;
    setDueDistanceLabel('Due Distance (' + units + ')');
    if (units === 'km') {
      setDefaultLongevityLabel('KM between maintenance');
    } else {
      setDefaultLongevityLabel('Miles between maintenance');
    }
    setErrorMessage('');
  }

  useEffect(() => {
    try {
      if (!isInitialized && bikes && bikes.length > 0) {
        updateLabels();
        if (isNew) {
          if (bikeIdString === '0') {
            selectDefaultBike();
          } else {
            selectBike(bikeIdString);
          }
          setIsInitialized(true);
        } else {
          reset();
        }
      }
    } catch (error) {
      console.error('Error initializing maintenance item: ', error);
    }
  }, [bikes, maintenanceItem]);
  
  const partSelected = (part: string | undefined) => {
    console.log('partSelected: ', part);
    if (null === part) return;
    console.log('PartSelected: ', part);
    setPart(ensureString(part));
    updateActionsList(bike, ensureString(part));
    setErrorMessage('');
  }

  const actionSelected = (selection: string | undefined) => {
    if (selection === null) return;
    setAction(ensureString(selection));
    setErrorMessage('');
  }

  const deadlineSelected = (selection: string | undefined) => {
    selection ? setDeadline(selection) : null;
    setErrorMessage('');
  }

  const dueDateChange = (e: any, date: Date | undefined) => {
    date instanceof Date ? setDueDate(date) : null;
    setErrorMessage('');
  }

  const dueMilesChange = (miles: string) => {
    setErrorMessage('');
    if (miles === '') {
      setDueMiles('0');
      return;
    }
    try {
      const parsedMiles = parseInt(miles).toFixed(0);
      if (parsedMiles.match(/^[0-9]+$/)) {
        setDueMiles(parsedMiles);
      }
    } catch (error) {
      console.log('Invalid due miles: ', miles);
    }
  }

  const defaultLongevityChange = (miles: string) => {
    if (miles === '') {
      setDefaultLongevity('0');
      return;
    }
    try {
      const parsedMiles = parseInt(miles).toFixed(0);
      if (parsedMiles.match(/^[0-9]+$/)) {
        setDefaultLongevity(parsedMiles);
      }
    } catch (error) {
      console.log('Invalid default longevity: ', miles);
    }
  }

  const defaultLongevityDaysChange = (days: string) => {
    if (days === '') {
      setDefaultLongevityDays('0');
      return;
    }
    try {
      const parsedDays = parseInt(days).toFixed(0);
      if (parsedDays.match(/^[0-9]+$/)) {
        setDefaultLongevityDays(parsedDays);
      }
    } catch (error) {
      console.log('Invalid default longevity days: ', days);
    }
  }

  const updateScrollStyle = () => {
    if (isMobile()) {
      const dimensions = Dimensions.get('window');
      const keyboardHeight = Keyboard.metrics()?.height;
      const adjustedHeight = keyboardHeight ? dimensions.height - (keyboardHeight - 80) : dimensions.height;
      const useStyle = isMobile() ? createStyles(dimensions.width, adjustedHeight) : defaultWebStyles
      setScrollStyle(useStyle);
    }
  }

  const validateDueDateString = () => {
    if (validateDateString(dueDateString)) {
      setDueDate(new Date(Date.parse(dueDateString)));
    }
  }

  const validateDateString = (dateString: string): boolean => {
    try {
      console.log('Validating due date string: ', dateString); 
      const parsedDate = Date.parse(dateString);
      if (!isNaN(parsedDate)) {
        const newDueDate = new Date(parsedDate);
        // setDueDate(newDueDate);
        // setDueDateString(newDueDate.toLocaleDateString());
        console.log('Parsed due date: ', newDueDate);
        if (newDueDate.getTime() < new Date().getTime()) {
          console.log('Invalid date.  Date should be in the future');
          setDueDateErrorMessage('Invalid date.  Date should be in the future');
          return false;
        }
        if (newDueDate.getTime() > (new Date().getTime() + fiveYears)) {
          console.log('Invalid date.  Date should be within 5 years');
          setDueDateErrorMessage('Invalid date.  Date should be within 5 years');
          return false;
        }
        setDueDateErrorMessage('');
        return true;
      }
      setDueDateErrorMessage('Invalid date.  Expected MM/DD/YYYY');
      return false;
    } catch (error) {
      console.error('Invalid due date string: ', dateString);
      return false;
    }
  }

  const dueDateStringChange = (dateString: string) => {
    setDueDateString(dateString);
    setDueDateErrorMessage('');
    console.log('dueDateStringChange: ', dateString); 
    if (dateString.length >= 10) {
      validateDateString(dateString);
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: 'Due: ' + ensureString(part) +' : '+ bikeName });
  }), [part, bikeName];

  useEffect(() => {
    if (isMobile()) {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardStatus('Keyboard Shown');
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardStatus('Keyboard Hidden');
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }
  }, []);

  useEffect(() => {
    updateScrollStyle()
  }, [keyboardStatus]);
  
  useEffect(() => {
    if (dueDate) {
      setDueDateString(dueDate.toLocaleDateString());
    }
  }, [dueDate]);
  
  return (
    <BaseLayout>
    <VStack className="w-full">
      <BikeDropdown
        bikes={bikes}
        value={bikeIdString}
        readonly={readOnly || !isNew}
        onSelect={selectBike} />
      <PartDropdown
        value={part}
        readonly={readOnly || !isNew}
        onSelect={partSelected}
        />
      <ActionDropdown
        value={action}
        readonly={readOnly || !isNew}
        actions={availabileActions}
        onSelect={actionSelected}
        />
      {readOnly ? null : <Dropdown
        options={deadlineOptions}
        label="Track by"
        value={deadline}
        onSelect={deadlineSelected}
        testID="deadlineDropdown"  />}
      {deadline == "Date"? null : (
        <Text>{dueDistanceLabel}</Text>
      )}
      {deadline == "Date"? null : (
        <Input
          variant="outline"
          size="md"
          isDisabled={readOnly || deadline == "Date"}
          isInvalid={false}
          isReadOnly={readOnly || deadline == "Date"}
        >
          <InputField 
            autoComplete="off"
            value={dueMiles.toString()}
            readOnly={readOnly}
            onChangeText={dueMilesChange}
            placeholder={"Mileage to " + action + " next here..."}
            testID="dueMilesInput"
            inputMode="numeric"
            accessibilityLabel="Due Milage"
            accessibilityHint="Milage when this maintenance should be performed next"/>
        </Input>
      )}
      {deadline == "Date"? null : (
        <Text>{defaultLongevityLabel}</Text>
      )} 
      {deadline == "Date"? null : (
        <Input
          variant="outline"
          size="md"
          isDisabled={readOnly || deadline == "Date"}
          isInvalid={false}
          isReadOnly={readOnly || deadline == "Date"}
        >
          <InputField 
            autoComplete="off"
            value={defaultLongevity}
            readOnly={readOnly}
            onChangeText={defaultLongevityChange}
            placeholder={"Mileage to " + action + " next here..."}
            inputMode="numeric"
            testID="defaultLongevityInput"
            accessibilityLabel="Default Longevity"
            accessibilityHint="Typical milage when this maintenance should be performed"/>
        </Input>
      )}
      {deadline == "Distance"? null : (
        <Text>Deadline</Text>
      )}
      {deadline == "Distance"? null : (
        <Input
          variant="outline"
          size="md"
          isDisabled={readOnly || deadline == "Distance"}
          isInvalid={false}
          isReadOnly={readOnly || deadline == "Distance"}
        >
          <InputField 
            autoComplete="off"
            value={dueDateString}
            readOnly={readOnly}
            onChangeText={dueDateStringChange}
            onBlur={validateDueDateString}
            placeholder={"Input due date for " + action + " here..."}
            testID="dueDateInput"
            inputMode="text"
            accessibilityLabel="Due Date"
            accessibilityHint="Date when this maintenance should be performed next"/>
        </Input>
      )}
      {deadline == "Distance"? null : (
        <Text className="text-sm text-error-900">{dueDateErrorMessage}</Text>
      )}
      {/* {readOnly && deadline == "Distance"? null : (
        <Text>Deadline</Text>
      )} */}
      {/* {readOnly && deadline == "Distance"? null : (
        isMobile() ? (
        <DateTimePicker
          locale="en"
          mode="date"
          minimumDate={today()}
          // validRange={{startDate: today()}}
          // disableStatusBarPadding={false}
          value={dueDate}
          onChange={dueDateChange}
          disabled={readOnly || deadline == "Distance"}
        />) : (
          <Input
          variant="outline"
          size="md"
          isDisabled={readOnly || deadline == "Distance"}
          isInvalid={false}
          isReadOnly={readOnly || deadline == "Distance"}
        >
          <InputField 
            autoComplete="off"
            value={dueDateString}
            readOnly={readOnly}
            onChangeText={dueDateStringChange}
            placeholder={"Mileage to " + action + " next here..."}
            testID="dueMilesInput"
            inputMode="numeric"
            accessibilityLabel="Due Milage"
            accessibilityHint="Milage when this maintenance should be performed"/>
        </Input>
        )
      )} */}

      {deadline == "Distance"? null : (
        <Text>Days between maintenance</Text>
      )}
      {deadline == "Distance"? null : (
        <Input
          variant="outline"
          size="md"
          isDisabled={readOnly || deadline == "Distance"}
          isInvalid={false}
          isReadOnly={readOnly || deadline == "Distance"}
        >
          <InputField 
            autoComplete="off"
            value={defaultLongevityDays}
            readOnly={readOnly}
            onChangeText={defaultLongevityDaysChange}
            placeholder={"Days between " + action + "s here..."}
            inputMode="numeric"
            testID="defaultLongevityDaysInput"
            accessibilityLabel="Default Longevity Days"
            accessibilityHint="Typical number of days between when this maintenance should be performed"/>
        </Input>)
      }
      <Text>Brand</Text>
      <Input
        variant="outline"
        size="md"
        isDisabled={readOnly}
        isInvalid={false}
        isReadOnly={readOnly}
      >
        <InputField 
          autoComplete="off"
          value={brand}
          readOnly={readOnly}
          onChangeText={setBrand}
          placeholder={"Brand of component here..."}
          testID="brandInput"
          inputMode="text"
          accessibilityLabel="Brand"
          accessibilityHint="Brand of part used"/>
      </Input>
      <Text>Model</Text>
      <Input
          variant="outline"
          size="md"
          isDisabled={readOnly}
          isInvalid={false}
          isReadOnly={readOnly}
        >
          <InputField 
            autoComplete="off"
            value={model}
            readOnly={readOnly}
            onChangeText={setModel}
            placeholder={"Model of component here..."}
            testID="modelInput"
            inputMode="text"
            accessibilityLabel="Model"
            accessibilityHint="Model of part used"/>
        </Input>
      <Text>Link</Text>
      <Input
          variant="outline"
          size="md"
          isDisabled={readOnly}
          isInvalid={false}
          isReadOnly={readOnly}
        >
          <InputField 
            autoComplete="off"
            value={link}
            readOnly={readOnly}
            onChangeText={setLink}
            placeholder={"URL of component here..."}
            testID="linkInput"
            inputMode="text"
            accessibilityLabel="Link"
            accessibilityHint="URL of part used"/>
      </Input>
      <HStack className="w-full flex bg-background-0 flex-grow justify-center">
          <Button 
            action="primary"
            onPress={ editOrDone }
            style={{flex: 1}} 
            accessibilityLabel="Finished"
            accessibilityHint="Save any changes and go back">
            <ButtonText>{readOnly ? "Edit" : "Done"}</ButtonText>
        </Button>
        { (!readOnly || isNew) ? null : (
          <Button 
            action="primary"
            onPress={ () => router.replace({pathname: '/(home)/(assistance)/instructions',  params: {part: part, action: action}}) }
            style={{flex: 1}} 
            accessibilityLabel="Finished"
            accessibilityHint="Save any changes and go back">
            <ButtonText>Instructions</ButtonText>
          </Button>
        )}
        { (readOnly || isNew) ? null : (
          <Button
            onPress={ cancel }
            style={{flex: 1}} 
            accessibilityLabel="Cancel"
            accessibilityHint="Go back without saving changes">
            <ButtonText>Cancel</ButtonText>
          </Button>
        )}
        { (readOnly || isNew || deleteLabel === 'History') ? null : (
          <Button
            onPress={ deleteMaintenanceItem }
            style={{flex: 1}} 
            accessibilityLabel="Delete"
            accessibilityHint="Go back without saving changes">
            <ButtonText>{deleteLabel}</ButtonText>
          </Button>
        )}
        { (readOnly || isNew || deleteLabel === 'History') ? (
          <Button
            onPress={ goToHistory }
            style={{flex: 1}} 
            accessibilityLabel="History"
            accessibilityHint="Maintenance History">
              <ButtonText>History</ButtonText>
          </Button>)
        : null}
        </HStack>
      </VStack>
    </BaseLayout>
  )
};

export default MaintenanceItemComponent;
