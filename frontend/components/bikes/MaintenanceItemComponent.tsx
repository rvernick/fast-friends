import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Button, TextInput, ActivityIndicator, Card, Surface } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { useSession } from "@/ctx";
import { ensureString } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MaintenanceItemController from "./MaintenanceItemController";
import { MaintenanceItem, Part } from "@/models/MaintenanceItem";

const groupsetBrands = [
  'Shimano',
  'SRAM',
  'Campagnolo',
  'Other',
]
const groupsetSpeeds = ['1', '9', '10', '11', '12', '13'];
const oneThousandMilesInMeters = 1609344;
const threeThousandMilesInMeters = 4828032;

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

type MaintenanceItemProps = {
  maintenanceid: number,
  bikeid: number,
};

const MaintenanceItemComponent: React.FC<MaintenanceItemProps> = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();
  const router = useNavigation();
  const email = session.email ? session.email : '';
  const searchParams = useLocalSearchParams();

  const maintenanceId = searchParams.maintenanceid? parseInt(ensureString(searchParams.maintenanceid)) : 0;
  const initialBikeId = searchParams.bikeid? ensureString(searchParams.bikeid): '0';
  
  const [isNew, setIsNew] = useState(maintenanceId === 0);
  const [maintenanceItem, setMaintenanceItem] = useState<MaintenanceItem>(newMaintenanceItem);
  const [bike, setBike] = useState<Bike>(newBike);
  const [bikeName, setBikeName] = useState('Select Bike');
  const [bikeIdString, setBikeIdString] = useState(initialBikeId);
  const [readOnly, setReadOnly] = useState(!isNew);
  const [part, setPart] = useState(Part.CHAIN.toString())
  const [dueMiles, setDueMiles] = useState('3000');
  const [brand, setBrand] = useState('Shimano');
  const [model, setModel] = useState('');
  const [link, setLink] = useState('');
  const partOptions = Object.entries(Part).map(([key, val]) => ({ label: val, value: val }));
  const [availabileParts, setAvailabileParts] = useState(partOptions);

  const [isInitialized, setIsInitialized] = useState(false);

  const controller = new MaintenanceItemController(appContext);

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
      1609 * parseInt(dueMiles),
      brand,
      model,
      link
    );
    if (successful) {
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
      reset();
      setReadOnly(true);
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
      router.goBack();
    }
  }

  const cancel = () => {
    setIsInitialized(false);
    setReadOnly(true);
    reset();
  }

  const resetMaintenanceItem = (item: MaintenanceItem) => {
    if (item) {
      setMaintenanceItem(item);
      if (item.id === 0) {
        setIsNew(true);
        console.log('Reset mi new with: ' + bikes.length);
        if (bikes && bikes.length > 0) {
          const latestBike = bikes[bikes.length - 1];
          selectBike(ensureString(latestBike.id));
        }
      } else {
        setIsNew(false);
        for (const bikeItem of bikes) {
          console.log('Reset checking bikeItems: ', JSON.stringify(bikeItem));
          if (bikeItem.maintenanceItems.some(mi => mi.id === item.id)) {
            selectBike(ensureString(bikeItem.id));
          }
        }
      }
      
      console.log('setting part to: ' + item.part.toString());
      setPart(ensureString(item.part.toString()));
      setDueMiles((item.dueDistanceMeters / 1609).toFixed(0));
      setBrand(ensureString(item.brand));
      setModel(ensureString(item.model));
      setLink(ensureString(item.link));
      console.log('Reset maintenance item: ', item.id );
      console.log('Reset bike: ', bikes.length );
    }
  }

  const updatePartsList = (thisBike: Bike) => {
    const result: any[] = [];
    const names = Object.values(Part);
    const keys = Object.keys(Part);
    console.log('Update parts for bike: ', JSON.stringify(bike));
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

  const selectBike = (idString: string | undefined) => {
    if (idString) {
      const id = parseInt(idString);
      const bikeById = bikes.find(bike => bike.id === id);
      if (bikeById) {
        console.log('Selected bike id: ', id);
        setBike(bikeById);
        const title = bikeById.name + ' (' + (bikeById.odometerMeters / 1609).toFixed(0) +' miles)'
        setBikeName(title);
        setBikeIdString(idString);
        updatePartsList(bikeById);
        ensureDueMilageAhead();
        console.log('Selected bikeById id: ', id);
      } else {
        console.log('Bike not found: ', idString);
      }
    }
  }

  const ensureDueMilageAhead = () => {
    if (isNew || !readOnly) {
      const currentMiles = bike.odometerMeters / 1609;
      const nextDueMiles = parseInt(dueMiles);
      if (currentMiles > nextDueMiles) {
        const forwardMiles = currentMiles + 1500;
        setDueMiles(forwardMiles.toFixed(0));
      }
    }
  };

  const reset = () => {
    try {
      console.log('useEffect initialize maintenance item: ', maintenanceId);
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
    const roomForMore = Object.keys(Part).length;
    const defaultBike = bikes.find((bike) => !bike.maintenanceItems || bike.maintenanceItems.length < roomForMore);
    if (defaultBike) {
      selectBike(ensureString(defaultBike.id));
    } else {
      console.log('No default bike found');
      selectBike(ensureString(bikes[0].id));
    }
  }

  useEffect(() => {
    try {
      console.log('useEffect initialize bike: ', bikes.length);
      if (!isInitialized && bikes.length > 0) {
        if (isNew) {
          selectDefaultBike();
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
  }
  const dueMilesChange = (miles: string) => {
    console.log('dueMilesChange: ', miles);
    try {
      const parsedMiles = parseInt(miles).toFixed(0);
      setDueMiles(parsedMiles);
    } catch (error) {
      console.log('Invalid due miles: ', miles);
    }
  }

  useEffect(() => {
    router.setOptions({ title: ensureString(part) +' : '+ bikeName });
  }), [part, bikeName];

  return (
    <Surface>
      <ActivityIndicator animating={!isInitialized} />
      <Card>
        <BikeDropdown bikes={bikes} value={bikeIdString} readonly={readOnly || !isNew} onSelect={selectBike} />
        <Dropdown
          label="Part"
          value={part}
          disabled={readOnly}
          mode="outlined"
          placeholder='Select Part'
          options={availabileParts}
          onSelect={partSelected}
          testID="partDropdown"
        />
        <TextInput 
          label="Due Distance (miles)"
          value={dueMiles.toString()}
          disabled={readOnly}
          onChangeText={dueMilesChange}
          testID="dueMilesInput"
       />
        <TextInput
          label={"Brand"}
          value={brand}
          disabled={readOnly}
          onChangeText={(text) => setBrand(text)}/>
        <TextInput
          label={"Model"}
          value={model}
          disabled={readOnly}
          onChangeText={(text) => setModel(text)}/>
        <TextInput
          label={"Link"}
          value={link}
          disabled={readOnly}
          onChangeText={(text) => setLink(text)}/>
        </Card>
        <Card>
          <Button mode="contained" onPress={ editOrDone } disabled={!readOnly && (part == null || bikeIdString == '0') }>
            { readOnly? 'Edit' : 'Done' }
          </Button>
          { (readOnly || isNew) ? null : <Button mode="contained" onPress={ cancel }> Cancel </Button>}
          { (readOnly || isNew) ? null : <Button mode="contained" onPress={ deleteMaintenanceItem }> Delete </Button>}
      </Card>
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
  }

export default MaintenanceItemComponent;
