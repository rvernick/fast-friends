import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useNavigation } from "expo-router";
import { Button, TextInput, ActivityIndicator, Surface} from "react-native-paper";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, isMobile, metersToDisplayString, milesToMeters, today } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Action, Part } from "@/models/MaintenanceItem";
import { BikeDropdown } from "../common/BikeDropdown";
import { PartDropdown } from "../common/PartDropdown";
import { ActionDropdown } from "../common/ActionDropdown";
import { Dimensions, ScrollView, View } from "react-native";
import { createStyles, defaultWebStyles } from "@/common/styles";
import { DatePickerInput } from 'react-native-paper-dates';
import { MaintenanceHistoryItem } from "@/models/MaintenanceHistory";
import MaintenanceHistoryItemController from "./MaintenanceHistoryItemController";

const threeThousandMilesInMeters = milesToMeters(3000);

const newMaintenanceHistoryItem = {
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
//  TODO: allow any combination of bike, part and action.  Create the maintenance item if necessary.

const newMaintenanceHistItem = {
  id: 0,
//  bike: Bike;
  bikeName: '',
  bikeId: 0,
  distanceMeters: 0,
  doneDate: today(),
  part: Part.FRONT_BRAKE_PADS.toString(),
  action: Action.REPLACE.toString(),
  name: '',
  brand: '',
  model: '',
  link: '',
  bikeOdemeterMeters: 0,
  dueDistanceMeters: 0,
  defaultLongevity: 1000,
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
  bikeDefinitionSummary: null,
}

type MaintenanceHistoryItemProps = {
  maintenancehistoryid: number,
  bikeid: number,
};

const MaintenanceHistoryItemComponent: React.FC<MaintenanceHistoryItemProps> = ({maintenancehistoryid, bikeid}) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();
  const navigation = useNavigation();
  const email = session.email ? session.email : '';

  const maintenanceHistoryId = maintenancehistoryid ? maintenancehistoryid : 0;
  const initialBikeId = bikeid ? ensureString(bikeid) : '0';

  const [isNew, setIsNew] = useState(maintenanceHistoryId === 0);
  console.log('MaintenanceHistoryItemComponent maintenanceHistoryId: '+ maintenanceHistoryId + ', bikeId: '+ initialBikeId +'');
  console.log('isNew: '+ isNew);
  const [maintenanceHistoryItem, setMaintenanceHistoryItem] = useState<MaintenanceHistoryItem>(newMaintenanceHistItem);
  const [bike, setBike] = useState<Bike>(newBike);
  const [bikeName, setBikeName] = useState('Select Bike');
  const [bikeIdString, setBikeIdString] = useState(initialBikeId);
  const [readOnly, setReadOnly] = useState(!isNew);
  const [part, setPart] = useState(Part.CHAIN.toString())
  const [action, setAction] = useState(Action.REPLACE.toString());
  const [doneOnMiles, setDoneOnMiles] = useState('1500');
  const [doneOnDate, setDoneOnDate] = useState(new Date(today().getTime()));
  const [doneOnDistanceLabel, setDoneOnDistanceLabel] = useState('Done on Distance (miles)');
  const [brand, setBrand] = useState('Shimano');
  const [model, setModel] = useState('');
  const [link, setLink] = useState('');

  const [isInitialized, setIsInitialized] = useState(false);

  const controller = new MaintenanceHistoryItemController(appContext);
  const preferences = controller.getUserPreferences(session);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

  const { data: bikes } = useQuery({
    queryKey: ['bikes'],
    initialData: [],
    queryFn: () => controller.getCurrentBikes(session, email),
  });

  const updateOrAddMaintenanceItem = async function() {
    const successful = await controller.updateOrAddMaintenanceHistoryItem(
      session,
      email,
      maintenanceHistoryItem.id,
      bike.id,
      part,
      action,
      displayStringToMeters(doneOnMiles, await preferences),
      doneOnDate,
      brand,
      model,
      link,
    );

    if (successful) {
      queryClient.removeQueries({ queryKey: ['history'] });
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

  const deleteMaintenanceHistoryItem = async () => {
    if (await controller.deleteMaintenanceHistoryItem(session, maintenanceHistoryItem.id)) {
      bike.maintenanceItems = bike.maintenanceItems.filter(mi => mi.id!== maintenanceHistoryItem.id);
      queryClient.removeQueries({ queryKey: ['bikes'] });
      queryClient.removeQueries({ queryKey: ['history'] });
      navigation.goBack();
    }
  }

  const cancel = () => {
    setIsInitialized(false);
    setReadOnly(true);
    reset();
  }

  const resetMaintenanceHistoryItem = async (item: MaintenanceHistoryItem) => {
    var bike: Bike | null = null;
    // TODO: need to have the model provide more info up from MaintenanceItem and Bike
    if (item) {
      console.log('Reset MI: ', JSON.stringify(item));
      setMaintenanceHistoryItem(item);
      setBikeName(item.bikeName);

      if (item.id === 0) {
        setIsNew(true);
        if (bikes) {
          console.log('Reset mi new with: ' + bikes.length);
        }
        if (bikes && bikes.length > 0) {
          const latestBike = bikes[bikes.length - 1];
          bike = await selectBike(ensureString(latestBike.id));
          setBikeName(latestBike.name);
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
      setDoneOnDate(new Date(item.doneDate));
      if (item.distanceMeters  && item.distanceMeters> 0) {
        setDoneOnMiles(metersToDisplayString(item.distanceMeters, await preferences));
      } else {
        if (bike) {
          setDoneOnMiles(metersToDisplayString(bike.odometerMeters, await preferences));
        }
      }
      setBrand(ensureString(item.brand));
      setModel(ensureString(item.model));
      setLink(ensureString(item.link));
      // setDoneOnDate(new Date());
      console.log('Reset maintenance item: ', item.id );
      // console.log('Reset bike: ', bikes.length );
    }
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
        setDoneOnMiles(metersToDisplayString(bikeById.odometerMeters, await preferences));
        console.log('Selected bikeById id: ', id);
        return bikeById;
      } else {
        console.log('Bike not found: ', idString);
      }
    }
    return null;
  }

  const reset = () => {
    try {
      // console.log('useEffect initialize maintenance item: ', maintenanceId);
      updateLabels();
      controller.getMaintenanceHistoryItem(session, maintenanceHistoryId, email).then(item => {
        if (item != null) {
          resetMaintenanceHistoryItem(item);
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
    setDoneOnDistanceLabel('Done on Distance (' + pref.units + ')');
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
  }, [bikes, maintenanceHistoryItem]);

  const partSelected = (part: string | undefined) => {
    console.log('partSelected: ', part);
    if (null === part) return;
    console.log('PartSelected: ', part);
    setPart(ensureString(part));
  }

  const actionSelected = (selection: string | undefined) => {
    if (selection === null) return;
    setAction(ensureString(selection));
  }

  const doneOnMilesChange = (miles: string) => {
    if (miles === '') {
      setDoneOnMiles('0');
      return;
    }
    try {
      const parsedMiles = parseInt(miles).toFixed(0);
      if (parsedMiles.match(/^[0-9]+$/)) {
        setDoneOnMiles(parsedMiles);
      }
    } catch (error) {
      console.log('Invalid due miles: ', miles);
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: ensureString(part) +' : '+ bikeName });
  }), [part, bikeName];


  return (
    <Surface style={useStyle.containerScreen}>
      {!isInitialized ? <ActivityIndicator animating={!isInitialized}  size="large"/> : null }
        <ScrollView contentContainerStyle={{flexGrow:1}} style={useStyle.containerBody}>
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
            onSelect={actionSelected}
            />
          <TextInput
            label={doneOnDistanceLabel}
            value={doneOnMiles.toString()}
            disabled={readOnly}
            onChangeText={doneOnMilesChange}
            inputMode="numeric"
            testID="dueMilesInput"
            accessibilityLabel="Due Milage"
            accessibilityHint="Milage when this maintenance should be performed"
          />
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'nowrap'}}>
            <DatePickerInput
              locale="en"
              validRange={{endDate: today()}}
              disableStatusBarPadding={false}
              label="Done On"
              value={doneOnDate}
              onChange={(d) => d instanceof Date ? setDoneOnDate(d) : null}
              inputEnabled={!readOnly}
              inputMode="start"
            />
          </View>
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
          </ScrollView>
        <Surface style={useStyle.bottomButtons}>
          <Button
            mode="contained"
            style={{flex: 1}}
            onPress={ editOrDone }
            disabled={!readOnly && (part == null || bikeIdString == '0') }
            accessibilityLabel="Finished"
            accessibilityHint="Save any changes and go back">
            { readOnly? 'Edit' : 'Done' }
          </Button>
          { (readOnly || isNew) ? null : <Button
            mode="contained" onPress={ cancel }
            style={{flex: 1}}
            accessibilityLabel="Cancel"
            accessibilityHint="Go back without saving changes">
          Cancel </Button>}
          { (readOnly || isNew) ? null : <Button
            mode="contained"
            style={{flex: 1}}
            onPress={ deleteMaintenanceHistoryItem }
            accessibilityLabel="Delete"
            accessibilityHint="Delete maintenance item"> Delete </Button>}
      </Surface>
    </Surface>
  )
};


export default MaintenanceHistoryItemComponent;

