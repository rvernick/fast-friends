import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { defaultMaintenanceItems } from "./default-maintenance";
import { router, useNavigation } from "expo-router";
import { useSession } from "@/common/ctx";
import { copy, ensureString, isMobileSize, metersToDisplayString, today } from "@/common/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {  SafeAreaView } from "react-native";
import { VStack } from "../ui/vstack";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { MaintenanceItem } from "@/models/MaintenanceItem";
import BikeConfigurationComponent from "./BikeConfigurationComponent";
import BulkAddMaintenanceComponent from "./BulkAddMaintenanceComponent";
import { MaintenanceLog } from "@/models/MaintenanceLog";
import { updateOrCreateMaintenanceItems } from "./common/maintenanceItemUtils";

const NULL_OPTIONAL_FIELD_ID = -1;

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
      year: '2022',
      brand: '',
      model: '',
      line: '',
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
  const [type, setType] = useState(newBike.type);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [logsCreatedFor, setLogsCreatedFor] = useState<number>(0);

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

  const skip = () => {
    if (page == MAINTENANCE) {
      goToNextBike();
      setPage(MODEL);
    } else {
      setPage(MAINTENANCE);
    }
  }

  const saveAndContinue = async () => {
    if (page == MAINTENANCE) {
      saveMaintenanceItems();
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
    queryClient.invalidateQueries({ queryKey: ['bikes'] });
    router.replace('/(home)/(maintenanceItems)/maintenance');
  }

  const resetBike = async (bike: Bike) => {
    const pref = await preferences
    const bikeCopy = copy(bike);
    setCurrentBike(bikeCopy);
    setIsDirty(false);
    setBikeName(ensureString(bike.name));
    ensureMaintenanceLogs(bikeCopy);
    setReadOnly(true);
  }

  const ensureMaintenanceLogs = (aBike: Bike) => {
      console.log('ensureMaintenanceLogs');
      if (logsCreatedFor == aBike.id) {
        return;
      }
      const logs = [];
      setLogsCreatedFor(aBike.id);
      var logId = 1;
      for (const item of defaultMaintenanceItems(aBike)) {
        var log = {
          id: logId++,
          bikeId: aBike.id,
          bikeMileage: aBike.odometerMeters,
          maintenanceItem: item,
          due: item.dueDistanceMeters,
          nextDue: item.dueDistanceMeters? aBike.odometerMeters + item.defaultLongevity : null,
          nextDate: item.dueDate? new Date(today().getTime() + item.defaultLongevityDays * 24 * 60 * 60 * 1000) : null,
          selected: false,
        }
        logs.push(log);
      }

      setMaintenanceLogs(logs);
    }

  const saveModelInfo = async function() {
    try {
      console.log('saveModelInfo ', currentBike);
      const result = await controller.updateBike(
        session,
        email,
        currentBike.id,
        currentBike.name,
        ensureString(currentBike.year),
        ensureString(currentBike.brand),
        ensureString(currentBike.model),
        ensureString(currentBike.line),
        currentBike.odometerMeters,
        currentBike.type,
        currentBike.groupsetBrand,
        currentBike.groupsetSpeed,
        currentBike.isElectronic,
        currentBike.isRetired,
        currentBike.bikeDefinitionSummary ? currentBike.bikeDefinitionSummary.id : NULL_OPTIONAL_FIELD_ID);
      console.log('update bike result: ' + result);
      queryClient.invalidateQueries({ queryKey: ['bikes'] });
   } catch (error) {
      console.error('Error saving bike: ', error);
    }
  };

  const saveMaintenanceItems = async () => {
    setErrorMessage('');
    const selectedItems = maintenanceLogs.filter(log => log.selected);

    const result = await updateOrCreateMaintenanceItems(session, selectedItems);
    console.log('submit maintenance result: ', result);
    if (result && result.length > 0) {
      setErrorMessage(result);
    }
  }

  useEffect(() => {
    if (!isInitialized && bikes && bikes.length > 0) {
      setIsInitialized(true);
      setCurrentBike(bikes[0]);
    }
  }, [bikes, isInitialized]);

  const markAsDirty = () => {
    setIsDirty(true);
    updateTitle();
  }

  const updateTitle = async () => {
    const pageAction = page === MODEL ? 'Model' : 'Maintenance Plan';
    const start = pageAction + ': '+ ensureString(currentBike.name);
    const mileageVal = isMobileSize() ? '' : ' - ' + metersToDisplayString(currentBike.odometerMeters, await preferences)
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
    updateTitle();
  }, [currentBike, page]);

  useEffect(() => {
    setToFirstBikeIfNotInitialized();
    if (page === MODEL) {
      setSaveLabel('Save');
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
      <VStack className="flex-1 justify-start">
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

            {page !== MODEL ? null : <BikeConfigurationComponent bike={currentBike} markDirty={markAsDirty}/>}
            {page !== MAINTENANCE ? null : <BulkAddMaintenanceComponent maintenanceLogs={maintenanceLogs} markDirty={markAsDirty}/>}
            {/* {page !== "frame" ? null : <BikeFrameComponent bike={bike} markDirty={markAsDirty}/>}   */}
            {/* {page !== "shifters" ? null : <BikeConfigurationComponent bike={bike} markDirty={markAsDirty}/>} */}
            {/* setDirty={setIsDirty} */}

        <HStack>
          <Button
            className="bottom-button shadow-md rounded-lg m-1 flex-1"
            action="primary"
            onPress={ saveAndContinue }
            accessibilityLabel="Finished editing"
            accessibilityHint="Will save any changes and go to the next screen">
            <ButtonText>{saveLabel}</ButtonText>
          </Button>
          <Button className="bottom-button shadow-md rounded-lg m-1 flex-1" onPress={ skip }>
            <ButtonText>Skip</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};

export default InitialConfigurationComponent;
