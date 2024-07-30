import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router } from "expo-router";
import { ThemedView } from "../ThemedView";
import { ActivityIndicator, Button, Checkbox, HelperText, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

const groupsetBrands = [
  'Shimano',
  'SRAM',
  'Campagnolo',
  'Other',
]
const groupsetSpeeds = ['1', '9', '10', '11', '12', '13'];

const newBike = {
      id: 0,
      name: '',
      groupsetBrand: 'Shimano',
      groupsetSpeed: 11,
      isElectronic: false,
  }
type BikeProps = {
  bikeid: number
};

const BikeComponent: React.FC<BikeProps> = ({ bikeid }) => {
  const appContext = useGlobalContext();
  const isNew = bikeid === 0;
  const [bikeName, setBikeName] = useState(newBike.name);
  const [readOnly, setReadOnly] = useState(!isNew);
  const [groupsetBrand, setGroupsetBrand] = useState(newBike.groupsetBrand);
  const [speed, setSpeeds] = useState(newBike.groupsetSpeed.toString());
  const [isElectronic, setIsElectronic] = useState(newBike.isElectronic);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(!isNew);

  const controller = new BikeController(appContext);

  const email = controller.getEmail();
  const user = appContext.getUser();

  const editOrDone = (value: any) => {
    if (!readOnly) {
      updateBike();
    } else {
      setReadOnly(false);
    }
  }

  const resetBike = (bike: Bike) => {
    setBikeName(bike.name);
    setGroupsetBrand(bike.groupsetBrand);
    setSpeeds(bike.groupsetSpeed.toString());
    setIsElectronic(bike.isElectronic);
    setReadOnly(true);
  }
  
  const updateBike = async function() {
    const result = await controller.updateBike(email, bikeid, bikeName, groupsetBrand, speed, isElectronic);
    console.log('update bike result: ' + result);
    if (result == '') {
      router.back();
    } else {
      setErrorMessage(result);
    }
  };

  const deleteBike = async function() {
    setErrorMessage('');
    const result = await controller.deleteBike(email, bikeid);
    if (result == '') {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(home)');
      }
    } else {
      setErrorMessage(result);
    }
  }

  const cancel = () => {
    setIsInitialized(false);
    setReadOnly(true);
  }

  const updateGroupsetBrand = (itemValue: string) => {
    setGroupsetBrand(itemValue);
  }

  const updateName = (name: string) => {
    setBikeName(name);
    setErrorMessage('');
  }

  useEffect(() => {
    if (!isInitialized) {
      controller.getBike(bikeid, email, appContext).then(bike => {
        if (bike!= null) {
          resetBike(bike);
          setIsInitialized(true);
        }
      });
    }
  });
  
  const groupsetOptions = groupsetBrands.map(brand => ({ label: brand, value: brand }));
  const speedOptions = groupsetSpeeds.map(speed => ({ label: speed, value: speed}));

  return (
    <ThemedView>
      <ActivityIndicator animating={isInitialized} />
      <TextInput label="Name" readOnly={readOnly} value={bikeName} onChangeText={updateName} placeholder="Name" />
      <HelperText type="error" >{errorMessage}</HelperText>
      <Dropdown
        disabled={readOnly}
        label="Groupset"
        placeholder="SRAM"
        options={groupsetOptions}
        value={groupsetBrand}
        onSelect={(value) => setGroupsetBrand(value ? value : '')}
      />
      <Dropdown
        disabled={readOnly}
        label="Speeds"
        placeholder="11"
        options={speedOptions}
        value={speed}
        onSelect={(value) => setSpeeds(value ? value : '')}
      />
      <Checkbox.Item label="Electric"
        disabled={readOnly}
        status={isElectronic ? "checked" : "unchecked"} 
        onPress={values => setIsElectronic(!isElectronic)}/>
        <Button onPress={ editOrDone }>
          { readOnly? 'Edit' : 'Done' }
        </Button>
        { (readOnly || isNew) ? null : <Button onPress={ cancel }> Cancel </Button>}
        { (readOnly || isNew) ? null : <Button onPress={ deleteBike }> Delete </Button>}
    </ThemedView>
  )
};

export default BikeComponent;