import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Checkbox, HelperText, TextInput, ActivityIndicator, Card, Surface } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { useSession } from "@/ctx";
import { ensureString } from "@/common/utils";

const groupsetBrands = [
  'Shimano',
  'SRAM',
  'Campagnolo',
  'Other',
]
const groupsetSpeeds = ['1', '9', '10', '11', '12', '13'];
const types = ['Road', 'Mountain', 'Hybrid', 'Cruiser', 'Electric', 'Cargo', 'Gravel'].sort();
const newBike = {
      id: 0,
      name: '',
      type: 'Road',
      groupsetBrand: 'Shimano',
      groupsetSpeed: 11,
      isElectronic: false,
  }
type BikeProps = {
  bikeid: number
};

const BikeComponent: React.FC<BikeProps> = () => {
  const session = useSession();
  const email = session.email ? session.email : '';

  const appContext = useGlobalContext();
  const { bikeid } = useLocalSearchParams();
  var bikeId = 0;
  if (typeof bikeid === 'string') {
    console.log('BikeComponent bikeid: '+ bikeid);
    bikeId = parseInt(bikeid);
  } else {
    console.error('Invalid bikeid parameter:'+ bikeid);
    bikeId = 0;
  }

  const isNew = bikeId === 0;
  const [bikeName, setBikeName] = useState(newBike.name);
  const [readOnly, setReadOnly] = useState(!isNew);
  const [groupsetBrand, setGroupsetBrand] = useState(newBike.groupsetBrand);
  const [speed, setSpeeds] = useState(newBike.groupsetSpeed.toString());
  const [type, setType] = useState(newBike.type);
  const [isElectronic, setIsElectronic] = useState(newBike.isElectronic);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(isNew);

  const controller = new BikeController(appContext);

  const editOrDone = (value: any) => {
    if (!readOnly) {
      updateBike();
    } else {
      setReadOnly(false);
    }
  }

  const resetBike = (bike: Bike) => {
    console.log('reset bike: ' + JSON.stringify(bike));
    setBikeName(ensureString(bike.name));
    setType(ensureString(bike.type));
    setGroupsetBrand(ensureString(bike.groupsetBrand));
    setSpeeds(ensureString(bike.groupsetSpeed));
    setIsElectronic(bike.isElectronic);
    setReadOnly(true);
  }
  
  const updateBike = async function() {
    const result = await controller.updateBike(session, email, bikeId, bikeName, type, groupsetBrand, speed, isElectronic);
    console.log('update bike result: ' + result);
    if (result == '') {
      router.back();
    } else {
      setErrorMessage(result);
    }
  };

  const deleteBike = async function() {
    setErrorMessage('');
    const result = await controller.deleteBike(session, email, bikeId);
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
      controller.getBike(session, bikeId, email, appContext).then(bike => {
        if (bike != null) {
          resetBike(bike);
          setIsInitialized(true);
        }
      });
    }
  });
  
  const groupsetOptions = groupsetBrands.map(brand => ({ label: brand, value: brand }));
  const speedOptions = groupsetSpeeds.map(speed => ({ label: speed, value: speed}));
  const typeOptions = types.map(type => ({ label: type, value: type }));

  return (
    <Surface>
      <ActivityIndicator animating={!isInitialized} />
      <Card>
        <Card.Title title={ bikeName || 'New Bike'} />
        <TextInput label="Name" readOnly={readOnly}
          value={bikeName}
          onChangeText={updateName}
          disabled={readOnly}
          placeholder="Name" />
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
          label="Type"
          placeholder="Road"
          options={typeOptions}
          value={type}
          onSelect={(value) => setType(value ? value : '')}
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
        </Card>
        <Card>
          <Button mode="contained" onPress={ editOrDone }>
            { readOnly? 'Edit' : 'Done' }
          </Button>
          { (readOnly || isNew) ? null : <Button mode="contained" onPress={ cancel }> Cancel </Button>}
          { (readOnly || isNew) ? null : <Button mode="contained" onPress={ deleteBike }> Delete </Button>}
      </Card>
    </Surface>
  )
};

export default BikeComponent;