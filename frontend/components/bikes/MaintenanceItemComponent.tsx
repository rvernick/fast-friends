import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Checkbox, HelperText, TextInput, ActivityIndicator, Card, Surface } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { useSession } from "@/ctx";
import { ensureString } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MaintenanceItemController from "./MaintenanceItemController";
import { MaintenanceItem, Part } from "@/models/MaintenanceItem";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

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
}

type MaintenanceItemProps = {
  maintenanceid: number,
  bikeid: number,
};

const BikeComponent: React.FC<MaintenanceItemProps> = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();
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

  // const [groupsetBrand, setGroupsetBrand] = useState(newBike.groupsetBrand);
  // const [speed, setSpeeds] = useState(newBike.groupsetSpeed.toString());
  // const [type, setType] = useState(newBike.type);
  // const [isElectronic, setIsElectronic] = useState(newBike.isElectronic);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(isNew);

  const controller = new MaintenanceItemController(appContext);

  const { data: bikes, status, error, isFetching } = useQuery({
    queryKey: ['bikes'],
    initialData: [],
    queryFn: () => controller.getBikes(session, email),
  });

  const updateMaintenanceItem = async function() {
    const successful = await controller.updateMaintenanceItem(
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
      updateMaintenanceItem();
    } else {
      setReadOnly(false);
    }
  }
  
  const deleteMaintenanceItem = async () => {
    if (await controller.deleteMaintenanceItem(session, email, maintenanceItem.id)) {
      bike.maintenanceItems = bike.maintenanceItems.filter(mi => mi.id!== maintenanceItem.id);
      queryClient.removeQueries({ queryKey: ['bikes'] });
      router.back();
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
      } else {
        setIsNew(false);
        for (const bikeItem of bikes) {
          console.log('Reset checking bikeItems: ', JSON.stringify(bikeItem));
          if (bikeItem.maintenanceItems.some(mi => mi.id === item.id)) {
            console.log('Found bike item: ', bikeItem.id);
            setBike(bikeItem);
            setBikeName(bikeItem.name + ' (' + (bikeItem.odometerMeters / 1609).toFixed(0) +'miles)');
            setBikeIdString(ensureString(bikeItem.id));
            updatePartsList(bikeItem);
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
    for (const possible in Object.values(Part)) {
      var unused = true;
      for (const mi of thisBike.maintenanceItems) {
        if (mi.id !== maintenanceId && (possible == mi.part || names[possible] == mi.part)) {
          unused = false;
          console.log('Found used part: ', possible);
        }
      }
      if (unused) {
          result.push({ label: names[possible], value: names[possible] });
      }
    }
    setAvailabileParts(result);
  }

  const selectBike = (idString: string | undefined) => {
    if (idString) {
      const id = parseInt(idString);
      const bikeById = bikes.find(bike => bike.id === id);
      if (bikeById) {
        console.log('Selected bike id: ', id);
        setBike(bikeById);
        setBikeName(bikeById.name + ' (' + (bikeById.odometerMeters / 1609).toFixed(0) +'miles)');
        setBikeIdString(idString);
        updatePartsList(bikeById);
        console.log('Selected bikeById id: ', id);
      } else {
        console.log('Bike not found: ', idString);
      }
    }
  }

  const reset = () => {
    console.log('useEffect initialize maintenance item: ', maintenanceId);
    controller.getMaintenanceItem(session, maintenanceId, email, appContext).then(item => {
      if (item != null) {
        resetMaintenanceItem(item);
        setIsInitialized(true);
      }
    });
  }

  useEffect(() => {
    console.log('useEffect initialize bike: ', bikes.length);
    if (!isInitialized && bikes.length > 0) {
      reset();
    }
  }, [bikes, maintenanceItem]);
  
  // const groupsetOptions = groupsetBrands.map(brand => ({ label: brand, value: brand }));
  // const speedOptions = groupsetSpeeds.map(speed => ({ label: speed, value: speed}));
  // const typeOptions = types.map(type => ({ label: type, value: type }));

  type BikeDropdownProps = {
    bikes: Bike[] | null | undefined;
    value: string;
    readonly: boolean;
    onSelect: (value: string) => void;
  };

  const BikeDropdown: React.FC<BikeDropdownProps> = ({ bikes, value, readonly, onSelect }) => {
    if (!bikes) return null;
    const bikeOptions = bikes.map(bike => ({ label: bike.name, value: ensureString(bike.id) }));
    console.log('BikeDropdown set: ', value);
    console.log('BikeDropdown options: ', JSON.stringify(bikeOptions));
    return (
      <Dropdown
          disabled={readonly}
          label="Bike"
          placeholder={ensureString(value)}
          options={bikeOptions}
          value={ensureString(value)}
          onSelect={(value) => selectBike(value)}
        />
    )
  }

  const partSelected = (part: string | undefined) => {
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

  return (
    <Surface>
      <ActivityIndicator animating={!isInitialized} />
      <Card>
        <Card.Title title={ 'Maintenance Item for: ' + bikeName } />
        <BikeDropdown bikes={bikes} value={bikeIdString} readonly={readOnly || !isNew} onSelect={selectBike} />
        <Dropdown
          label="Part"
          value={part}
          disabled={readOnly}
          mode="outlined"
          placeholder='Select Part'
          options={availabileParts}
          onSelect={partSelected}
        />
        <TextInput 
          label="Due Distance (miles)"
          value={dueMiles.toString()}
          disabled={readOnly}
          onChangeText={dueMilesChange}
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
          <Button mode="contained" onPress={ editOrDone }>
            { readOnly? 'Edit' : 'Done' }
          </Button>
          { (readOnly || isNew) ? null : <Button mode="contained" onPress={ cancel }> Cancel </Button>}
          { (readOnly || isNew) ? null : <Button mode="contained" onPress={ deleteMaintenanceItem }> Delete </Button>}
      </Card>
    </Surface>
  )
};

export default BikeComponent;



/** 
const defaultLongevity = (part: Part): number => {
  if (part === Part.FRONT_BRAKE_PADS || part === Part.REAR_BRAKE_PADS) {
    return oneThousandMilesInMeters;
  }
  return threeThousandMilesInMeters;
}

const oneThousandMilesInMeters = 1609344;
const threeThousandMilesInMeters = 4828032;

export const defaultMaintenanceItems = (bike: Bike): MaintenanceItem[] => {
  const maintenanceItems: MaintenanceItem[] = [];
  const odometerMeters = bike.odometerMeters == null ? 0 : bike.odometerMeters;
  const oneThousandMiles = odometerMeters + oneThousandMilesInMeters;
  const threeThousandMiles = odometerMeters + threeThousandMilesInMeters;
  maintenanceItems.push(createMaintenanceItem(Part.CHAIN, threeThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.CASSETTE, threeThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.FRONT_TIRE, threeThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.REAR_TIRE, threeThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.FRONT_BRAKE_PADS, oneThousandMiles));
  maintenanceItems.push(createMaintenanceItem(Part.REAR_BRAKE_PADS, oneThousandMiles));
  return maintenanceItems;
}

const createMaintenanceItem = (part: Part, distance: number): MaintenanceItem => {
  const maintenanceItem = new MaintenanceItem();
  maintenanceItem.part = part;
  maintenanceItem.dueDistanceMeters = distance;
  return maintenanceItem;
}

  bike: Promise<Bike>;
  
  @Column({
    type: "enum",
    enum: Part,
    default: Part.CHAIN,
    nullable: false,
  })
  part: Part;
  type: string;
  brand: string;
  model: string;
  link: string;
  lastPerformedDistanceMeters: number;
  dueDistanceMeters: number;
  dueDate: Date;
  @Column({default: false})
  completed: boolean;

 */