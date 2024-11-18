import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Button, TextInput, ActivityIndicator, Card, Surface, Tooltip } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { useSession } from "@/ctx";
import { displayStringToMeters, ensureString, metersToDisplayString, milesToMeters } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MaintenanceItemController from "./MaintenanceItemController";
import { Action, MaintenanceItem, Part } from "@/models/MaintenanceItem";
import { BooleanDropdown } from "../common/BooleanDropdown";
import { BikeDropdown } from "../common/BikeDropdown";

const groupsetBrands = [
  'Shimano',
  'SRAM',
  'Campagnolo',
  'Other',
]
const groupsetSpeeds = ['1', '9', '10', '11', '12', '13'];
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
  defaultLongevity: 3000,
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
}

type MaintenanceItemProps = {
  maintenanceid: number,
  bikeid: number,
};

const MaintenanceItemComponent: React.FC<MaintenanceItemProps> = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();
  const navigation = useNavigation();
  const email = session.email ? session.email : '';
  const searchParams = useLocalSearchParams();

  const maintenanceId = searchParams.maintenanceId? parseInt(ensureString(searchParams.maintenanceId)) : 0;
  const initialBikeId = searchParams.bikeId? ensureString(searchParams.bikeId): '0';
  
  const [isNew, setIsNew] = useState(maintenanceId === 0);
  const [maintenanceItem, setMaintenanceItem] = useState<MaintenanceItem>(newMaintenanceItem);
  const [bike, setBike] = useState<Bike>(newBike);
  const [bikeName, setBikeName] = useState('Select Bike');
  const [bikeIdString, setBikeIdString] = useState(initialBikeId);
  const [readOnly, setReadOnly] = useState(!isNew);
  const [part, setPart] = useState(Part.CHAIN.toString())
  const [action, setAction] = useState(Action.REPLACE.toString());
  const [dueMiles, setDueMiles] = useState('1500');
  const [dueDistanceLabel, setDueDistanceLabel] = useState('Due Distance (miles)');
  const [defaultLongevityLabel, setDefaultLongevityLabel] = useState('Default Longevity (miles)');
  const [brand, setBrand] = useState('Shimano');
  const [model, setModel] = useState('');
  const [link, setLink] = useState('');
  const [defaultLongevity, setDefaultLongevity] = useState('1500');
  const [autoAdjustLongevity, setAutoAdjustLongevity] = useState(true);

  const partOptions = Object.entries(Part).map(([key, val]) => ({ label: val, value: val }));
  const [availabileParts, setAvailabileParts] = useState(partOptions);

  const actionOptions = Object.entries(Action).map(([key, val]) => ({ label: val, value: val }));
  const [availabileActions, setAvailableActions] = useState(actionOptions);
  const [isInitialized, setIsInitialized] = useState(false);

  const controller = new MaintenanceItemController(appContext);
  const preferences = controller.getUserPreferences(session);

  const { data: bikes } = useQuery({
    queryKey: ['bikes'],
    initialData: [],
    queryFn: () => controller.getBikes(session, email),
  });

  const updateOrAddMaintenanceItem = async function() {
    const successful = await controller.updateOrAddMaintenanceItem(
      session,
      email,
      maintenanceItem.id,
      bike.id,
      part,
      action,
      displayStringToMeters(dueMiles, await preferences),
      brand,
      model,
      link,
      displayStringToMeters(defaultLongevity, await preferences),
      autoAdjustLongevity,
    );
    if (successful) {
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
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
    }
  }

  const cancel = () => {
    setIsInitialized(false);
    setReadOnly(true);
    reset();
  }

  const resetMaintenanceItem = async (item: MaintenanceItem) => {
    if (item) {
      setMaintenanceItem(item);
      if (item.id === 0) {
        setIsNew(true);
        if (bikes) {
          console.log('Reset mi new with: ' + bikes.length);
        }
        if (bikes && bikes.length > 0) {
          const latestBike = bikes[bikes.length - 1];
          selectBike(ensureString(latestBike.id));
        }
      } else {
        setIsNew(false);
        if (bikes) {
          for (const bikeItem of bikes) {
            console.log('Reset checking bikeItems: ', JSON.stringify(bikeItem));
            if (bikeItem.maintenanceItems.some(mi => mi.id === item.id)) {
              selectBike(ensureString(bikeItem.id));
            }
          }
        }
      }
      
      console.log('setting part to: ' + item.part.toString());
      setPart(ensureString(item.part.toString()));
      setAction(ensureString(item.action.toString()));
      setDueMiles(metersToDisplayString(item.dueDistanceMeters, await preferences));
      setBrand(ensureString(item.brand));
      setModel(ensureString(item.model));
      setLink(ensureString(item.link));
      setDefaultLongevity(metersToDisplayString(item.defaultLongevity, await preferences));
      setAutoAdjustLongevity(item.autoAdjustLongevity);
      console.log('Reset maintenance item: ', item.id );
      // console.log('Reset bike: ', bikes.length );
    }
  }

  const updatePartsList = (thisBike: Bike) => {
    const result: any[] = [];
    const names = Object.values(Part);
    const keys = Object.keys(Part);
    // console.log('Update parts for bike: ', JSON.stringify(bike));
    var substitutePartIfNeeded = '';
    var isSubstitutePartNeeded = false;
    for (const possible in Object.values(Part)) {
      var unused = true;
      for (const mi of thisBike.maintenanceItems) {
        if (mi.id !== maintenanceId && (possible == mi.part || names[possible] == mi.part)) {
          unused = false;
          if (!part || part.length === 0 || part === names[possible]) {
            isSubstitutePartNeeded = true;
          }
        }
      }
      if (unused) {
        result.push({ label: names[possible], value: names[possible] });
        if (substitutePartIfNeeded == '') {
          substitutePartIfNeeded = names[possible];
        }
      }
    }
    setAvailabileParts(result);
    if (isSubstitutePartNeeded) {
      console.log('Setting substitute part: ', substitutePartIfNeeded);
      setPart(substitutePartIfNeeded);
    }
  }

  const updateActionsList = (bike: Bike, selectedPart: string) => {
    const unusedActions = getUnusedActions(bike, selectedPart);
    const actionOptions = unusedActions.map(act => ({ label: act, value: act }))
    setAvailableActions(actionOptions);
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


  const selectBike = async (idString: string | undefined) => {
    if (idString && bikes) {
      const id = parseInt(idString);
      const bikeById = bikes.find(bike => bike.id === id);
      if (bikeById) {
        console.log('Selected bike idString: ', idString);
        setBike(bikeById);
        const prefs = await preferences;
        const title = bikeById.name + ' (' + metersToDisplayString(bikeById.odometerMeters, prefs) +' ' + prefs.units + ')'
        setBikeName(title);
        setBikeIdString(idString);
        // updatePartsList(bikeById);
        updateActionsList(bikeById, part);
        ensureDueMilageAhead(bikeById);
        console.log('Selected bikeById id: ', id);
      } else {
        console.log('Bike not found: ', idString);
      }
    }
  }

  const ensureDueMilageAhead = async (toBike: Bike) => {
    if (isNew || !readOnly) {
      const currentMeters = toBike.odometerMeters;
      const nextDueMeters = displayStringToMeters(dueMiles, await preferences);
      if (currentMeters  > nextDueMeters) {
        const forwardMeters = currentMeters + milesToMeters(1500);
        setDueMiles(metersToDisplayString(forwardMeters, await preferences));
      }
    }
  };

  const reset = () => {
    try {
      // console.log('useEffect initialize maintenance item: ', maintenanceId);
      updateLabels();
      controller.getMaintenanceItem(session, maintenanceId, email, appContext).then(item => {
        if (item != null) {
          resetMaintenanceItem(item);
          setIsInitialized(true);
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
    setDueDistanceLabel('Due Distance (' + pref.units + ')');
    setDefaultLongevityLabel('Default Longevity (' + pref.units + ')');
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
  
  // const groupsetOptions = groupsetBrands.map(brand => ({ label: brand, value: brand }));
  // const speedOptions = groupsetSpeeds.map(speed => ({ label: speed, value: speed}));
  // const typeOptions = types.map(type => ({ label: type, value: type }));

  const partSelected = (part: string | undefined) => {
    console.log('partSelected: ', part);
    if (null === part) return;
    console.log('PartSelected: ', part);
    setPart(ensureString(part));
    updateActionsList(bike, ensureString(part));
  }

  const actionSelected = (selection: string | undefined) => {
    if (selection === null) return;
    setAction(ensureString(selection));
  }

  const dueMilesChange = (miles: string) => {
    console.log('dueMilesChange: ', miles);
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

  useEffect(() => {
    navigation.setOptions({ title: ensureString(part) +' : '+ bikeName });
  }), [part, bikeName];

  return (
    <Surface>
      <ActivityIndicator animating={!isInitialized} />
      <Card>
        <BikeDropdown
          bikes={bikes}
          value={bikeIdString}
          readonly={readOnly || !isNew}
          onSelect={selectBike} />
        <Dropdown
          label="Part"
          value={part}
          disabled={readOnly || !isNew}
          mode="outlined"
          placeholder='Select Part'
          options={availabileParts}
          onSelect={partSelected}
          testID="partDropdown"
        />
        <Dropdown
          label="Action"
          value={action}
          disabled={readOnly || !isNew}
          mode="outlined"
          placeholder='Select Action'
          options={availabileActions}
          onSelect={actionSelected}
          testID="actionDropdown"
        />
        <TextInput 
          label={dueDistanceLabel}
          value={dueMiles.toString()}
          disabled={readOnly}
          onChangeText={dueMilesChange}
          testID="dueMilesInput"
          accessibilityLabel="Due Milage"
          accessibilityHint="Milage when this maintenance should be performed"
       />
        <TextInput 
          label={defaultLongevityLabel}
          value={defaultLongevity.toString()}
          disabled={readOnly}
          onChangeText={defaultLongevityChange}
          testID="defaultLongevityInput"
          accessibilityLabel="Default Longevity"
          accessibilityHint="Typical milage when this maintenance should be performed"
       />
       <Tooltip title="Auto Adjust: Use historical maintenance pattern to update longevity">
        <BooleanDropdown
            label={"Auto Adjust Longevity"}
            value={autoAdjustLongevity}
            readonly={readOnly}
            onSelect={(value: boolean) => setAutoAdjustLongevity(value)}
          />
       </Tooltip>
        <TextInput
          label={"Brand"}
          value={brand}
          disabled={readOnly}
          onChangeText={(text) => setBrand(text)}
          accessibilityLabel="Brand"
          accessibilityHint="Brand of part used"/>
        <TextInput
          label={"Model"}
          value={model}
          disabled={readOnly}
          onChangeText={(text) => setModel(text)}
          accessibilityLabel="Model"
          accessibilityHint="Model of part used"/>
        <TextInput
          label={"Link"}
          value={link}
          disabled={readOnly}
          onChangeText={(text) => setLink(text)}
          accessibilityLabel="Link"
          accessibilityHint="URL of part used"/>
        </Card>
        <Card>
          <Button
            mode="contained"
            onPress={ editOrDone }
            disabled={!readOnly && (part == null || bikeIdString == '0') }
            accessibilityLabel="Finished"
            accessibilityHint="Save any changes and go back">
            { readOnly? 'Edit' : 'Done' }
          </Button>
          { (!readOnly && !isNew) ? null : <Button 
            mode="outlined"
            onPress={ () => router.push({pathname: '/(home)/(maintenanceItems)/instructions',  params: {part: part, action: action}}) }
        >Instructions</Button>}
          { (readOnly || isNew) ? null : <Button 
            mode="contained" onPress={ cancel }
            accessibilityLabel="Cancel"
            accessibilityHint="Go back without saving changes">
          Cancel </Button>}
          { (readOnly || isNew) ? null : <Button
            mode="contained"
            onPress={ deleteMaintenanceItem }
            accessibilityLabel="Delete"
            accessibilityHint="Delete maintenance item"> Delete </Button>}
      </Card>
    </Surface>
  )
};


export default MaintenanceItemComponent;
