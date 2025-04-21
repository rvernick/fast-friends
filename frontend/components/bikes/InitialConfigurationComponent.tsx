import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useNavigation } from "expo-router";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, fetchUser, isMobile, isMobileSize, metersToDisplayString } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Linking, SafeAreaView } from "react-native";
import { BaseLayout } from "../layouts/base-layout";
import { VStack } from "../ui/vstack";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Radio, RadioGroup, RadioLabel } from "../ui/radio";
import { MaintenanceItem } from "@/models/MaintenanceItem";
import BikeConfigurationComponent from "./BikeConfigurationComponent";
import BulkAddMaintenanceComponent from "./BulkAddMaintenanceComponent";

const NULL_OPTIONAL_FIELD_ID = -1;

const groupsetBrands = [
  'Shimano',
  'SRAM',
  'Campagnolo',
  'Other',
]

const groupsetSpeeds = ['1', '9', '10', '11', '12', '13'];
const types = ['Road', 'Mountain', 'Hybrid', 'Cruiser', 'Electric', 'Cargo', 'Gravel'].sort();
const miArray: MaintenanceItem[] = new Array(0);

const newBike = {
      id: 0,
      name: '',
      type: 'Road',
      groupsetBrand: 'Shimano',
      groupsetSpeed: 11,
      isElectronic: false,
      odometerMeters: 0,
      isRetired: false,
      maintenanceItems: miArray,
      stravaId: '',
      bikeDefinitionSummary: null,
  }


const InitialConfigurationComponent = () => {
  const session = useSession();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();

  const email = session.email ? session.email : '';

  const [currentBike, setCurrentBike] = useState<Bike>(newBike);
  const [bikeName, setBikeName] = useState(newBike.name);
  const [readOnly, setReadOnly] = useState(false);
  const [groupsetBrand, setGroupsetBrand] = useState(newBike.groupsetBrand);
  const [speed, setSpeeds] = useState(newBike.groupsetSpeed.toString());
  const [type, setType] = useState(newBike.type);
  const [isElectronic, setIsElectronic] = useState(newBike.isElectronic);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [stravaId, setStravaId] = useState('');
  const [milage, setMileage] = useState(newBike.odometerMeters.toFixed(0));
  const [milageLabel, setMileageLabel] = useState('Mileage');
  const [isRetired, setIsRetired] = useState(newBike.isRetired);
  const [connectedToStrava, setConnectedToStrava] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const MODEL = 'Model';
  const MAINTENANCE = 'Maintenance';
  const [page, setPage] = useState(MODEL);
  const [saveLabel, setSaveLabel] = useState('Save & Next Bike');

  const controller = new BikeController(appContext);
  const preferences = controller.getUserPreferences(session);

  const { data: bikes } = useQuery({
    queryKey: ['bikes'],
    initialData: [],
    queryFn: () => controller.getCurrentBikes(session, email),
  });


  const saveAndContinue = async () => {
    if (page == MAINTENANCE) {
      // saveMaintenanceItems();  TODO
      goToNextBike();
      setPage(MODEL);
    } else {
      await saveModelInfo();
      setPage(MAINTENANCE);
    }
   }

  const goToNextBike = () => {
    if (!bikes || bikes.length === 0) return;
    var bikeMatched = false;
    for (const bike of bikes) {
      if (bikeMatched) {
        resetBike(bike);
        return;
      }
      if (currentBike.id == bike.id) {
        bikeMatched = true;
      }
    }
    console.log('No more bikes to go to, returning to first');
  }

  const resetBike = async (bike: Bike) => {
    const pref = await preferences
    setCurrentBike(bike);
    setMileageLabel('Mileage (' + pref.units + ')');
    console.log('reset bike: ' + JSON.stringify(bike));
    setBikeName(ensureString(bike.name));
    setType(ensureString(bike.type));
    setGroupsetBrand(ensureString(bike.groupsetBrand));
    setSpeeds(ensureString(bike.groupsetSpeed));
    setIsElectronic(bike.isElectronic);
    setIsRetired(bike.isRetired);
    setMileage(metersToDisplayString(bike.odometerMeters, pref));
    setStravaId(ensureString(bike.stravaId));
    checkConnectedToStrava(bike.stravaId);
    setReadOnly(true);
  }

  const goBack = () => {  // maybe in AppController?
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(home)');
    }
  }

  const saveModelInfo = async function() {
    try {
      const result = await controller.updateBike(
        session, email,
        currentBike.id,
        bikeName,
        displayStringToMeters(milage, await preferences),
        type,
        groupsetBrand,
        speed,
        isElectronic,
        isRetired,
        currentBike.bikeDefinitionSummary ? currentBike.bikeDefinitionSummary.id : NULL_OPTIONAL_FIELD_ID);
      console.log('update bike result: ' + result);
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
      if (result == '') {
        goBack();
      } else {
        setErrorMessage(result);
      }
    } catch (error) {
      console.error('Error saving bike: ', error);
    }
  };

  const cancel = () => {
    setIsInitialized(false);
    setReadOnly(true);
  }

  const updatePage = (newPage: string) => {
    setPage(newPage);
    console.log("Switching to page: ", newPage);
  }

  const updateGroupsetBrand = (itemValue: string) => {
    setGroupsetBrand(itemValue);
  }

  const updateName = (name: string) => {
    setBikeName(name);
    navigation.setOptions({ title: name });
    setErrorMessage('');
  }

  useEffect(() => {
    if (!isInitialized && bikes && bikes.length > 0) {
      setIsInitialized(true);
      setCurrentBike(bikes[0]);
    }
  }, [bikes, isInitialized]);

  const checkConnectedToStrava = (stravaId: string | null) => {
    setConnectedToStrava(
      stravaId !== null
        && stravaId !== ''
        && stravaId!= '0');
  }

  const markAsDirty = () => {
    setIsDirty(true);
  }

  const updateTitle = async (page: string, aBike: Bike) => {
    const pageAction = page === MODEL ? 'Model' : 'Maintenance Plan';
    const start = pageAction + ': '+ ensureString(aBike.name);
    const mileageVal = isMobileSize() ? '' : ' - ' + metersToDisplayString(aBike.odometerMeters, await preferences)
    const title = start + mileageVal;
    navigation.setOptions({ title: title });
  }

  const setToFirstBikeIfNotInitialized = () => {
    if (bikes && bikes.length > 0) {
      if (currentBike.id === 0) {
        resetBike(bikes[0]);
      }
    }
  }

  useEffect(() => {
    updateTitle(page, currentBike);
  }, [currentBike, page]);

  useEffect(() => {
    setToFirstBikeIfNotInitialized();
    if (page === MODEL) {
      setSaveLabel('Build Maintenance Plan');
    } else if (page === MAINTENANCE) {
      if (bikes && bikes.length > 1) {
        if (currentBike.id === 0) {
          resetBike(bikes[0]);
        }
        if (currentBike.id === bikes[bikes.length - 1].id) {
          setSaveLabel('Save & Finish');
        } else {
          setSaveLabel('Save & Next Bike');
        }
      } else {
        setSaveLabel('Save & Finish');
      }
    }
  }, [page, currentBike, bikes]);

  return (
    <SafeAreaView className="w-full h-full">
      <VStack className="justify-start">
        {/* <RadioGroup
            className="w-full"
            value={page}
            isDisabled={isDirty}
            onChange={updatePage}
            testID="page-selection">
          <HStack className="w-full justify-evenly ">
            <Radio value={MODEL} testID="model-selector">
              <RadioLabel>Model</RadioLabel>
            </Radio>
            <Radio value={MAINTENANCE} testID="maintenance-selector">
              <RadioLabel>Maintenance</RadioLabel>
            </Radio>
          </HStack>
        </RadioGroup> */}
        <VStack>
          {page !== MODEL ? null : <BikeConfigurationComponent bike={currentBike} markDirty={markAsDirty}/>}
          {page !== MAINTENANCE ? null : <BulkAddMaintenanceComponent bike={currentBike} markDirty={markAsDirty}/>}
          {/* {page !== "frame" ? null : <BikeFrameComponent bike={bike} markDirty={markAsDirty}/>}   */}
          {/* {page !== "shifters" ? null : <BikeConfigurationComponent bike={bike} markDirty={markAsDirty}/>} */}
          {/* setDirty={setIsDirty} */}
        </VStack>
        <HStack>
          <Button
            className="bottom-button shadow-md rounded-lg m-1"
            action="primary"
            onPress={ saveAndContinue }
            style={{flex: 1}}
            accessibilityLabel="Finished editing"
            accessibilityHint="Will save any changes and go to the next screen">
            <ButtonText>{saveLabel}</ButtonText>
          </Button>
          <Button className="bottom-button shadow-md rounded-lg m-1" style={{flex: 1}} onPress={ cancel }>
            <ButtonText>Skip</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};


/**
 *
 <SafeAreaView className="w-full h-full">
      <ScrollView
        className="w-full h-full"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <HStack className="w-full h-full bg-background-0 flex-grow justify-center">
          <VStack
            className="relative hidden md:flex h-full w-full flex-1  items-center  justify-center"
            space="md"
          >
            <Image
              // height="100%"
              // width="100%"
              source={require("@/assets/images/spiral-gears.jpg")}
              className="object-cover h-full w-full"
              alt="Radial Gradient"
            />
          </VStack>
          <VStack className="md:items-center md:justify-start flex-1 w-full  p-9 md:gap-10 gap-16 md:m-auto md:w-1/2 h-full">
            {props.children}
          </VStack>
        </HStack>
      </ScrollView>
    </SafeAreaView>

 */
export default InitialConfigurationComponent;