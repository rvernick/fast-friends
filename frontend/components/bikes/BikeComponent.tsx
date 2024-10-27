import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Button, Checkbox, HelperText, TextInput, ActivityIndicator, Card, Surface, Text } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { useSession } from "@/ctx";
import { ensureString, isMobile, metersToMilesString, milesToMeters } from "@/common/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Linking } from "react-native";

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
      odometerMeters: 0,
  }
type BikeProps = {
  bikeid: number
};

const BikeComponent: React.FC<BikeProps> = () => {
  const session = useSession();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

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
  const [stravaId, setStravaId] = useState('');
  const [milage, setMileage] = useState(newBike.odometerMeters.toFixed(0));

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
    navigation.setOptions({ title: ensureString(bike.name) });
    setType(ensureString(bike.type));
    setGroupsetBrand(ensureString(bike.groupsetBrand));
    setSpeeds(ensureString(bike.groupsetSpeed));
    setIsElectronic(bike.isElectronic);
    setMileage(metersToMilesString(bike.odometerMeters));
    setStravaId(ensureString(bike.stravaId));
    setReadOnly(true);
  }
  
  const updateBike = async function() {
    const result = await controller.updateBike(session, email, bikeId,
      bikeName,
      milesToMeters(parseInt(milage)),
      type,
      groupsetBrand,
      speed,
      isElectronic);
    console.log('update bike result: ' + result);
    queryClient.invalidateQueries({ queryKey: ['bikes'] });
    if (result == '') {
      router.back();
    } else {
      setErrorMessage(result);
    }
  };

  const deleteBike = async function() {
    setErrorMessage('');
    const result = await controller.deleteBike(session, email, bikeId);
    queryClient.invalidateQueries({ queryKey: ['bikes'] });
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

  const maintenanceHistory = () => {
    router.replace({ pathname: '/(home)/(maintenanceItems)/history', params: { bikeId: bikeId } });
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
    if (!isInitialized) {
      controller.getBike(session, bikeId, email, appContext).then(bike => {
        if (bike != null) {
          resetBike(bike);
          setIsInitialized(true);
        }
      });
    }
  });

  const connectedToStrava = () => {
    return stravaId !== null 
      && stravaId !== ''
      && stravaId!= '0';
  }

  const viewOnStrava = async () => {
    var idWithoutTheB = stravaId.replace('b', '');
    var uri = 'strava://bikes/' + idWithoutTheB;
    var url = `https://www.strava.com/bikes/${idWithoutTheB}`;

    if (isMobile() && await Linking.canOpenURL(uri)) {
      Linking.openURL(uri).catch(err => console.error('Error opening strava link: ', err));
    } else {
      Linking.openURL(url).catch(err => console.error('Error opening strava link: ', err));
    }
  }
  
  const groupsetOptions = groupsetBrands.map(brand => ({ label: brand, value: brand }));
  const speedOptions = groupsetSpeeds.map(speed => ({ label: speed, value: speed}));
  const typeOptions = types.map(type => ({ label: type, value: type }));

  return (
    <Surface>
      <ActivityIndicator animating={!isInitialized} />      
      <Card>
        <TextInput label="Name" readOnly={readOnly}
          value={bikeName}
          onChangeText={updateName}
          disabled={readOnly}
          placeholder="Name"
          accessibilityLabel="Bike Name"
          accessibilityHint="Name of the bike" />
        <HelperText type="error" >{errorMessage}</HelperText>
        <TextInput label="Milage"
          disabled={readOnly || connectedToStrava()}
          value={milage}
          onChangeText={(value) => setMileage(value ? value : '')}
          accessibilityLabel="Milage"
          accessibilityHint="Mileage of the bike"/>
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
          onPress={values => setIsElectronic(!isElectronic)}
          accessibilityLabel="Has Electric Assist"/>
        </Card>
        <Card>
          <Button mode="contained"
            onPress={ editOrDone }
            accessibilityLabel="Finished editing"
            accessibilityHint="Will save any changes and go back">
            { readOnly? 'Edit' : 'Done' }
          </Button>
          { (readOnly || isNew) ? null : <Button mode="contained" onPress={ cancel }> Cancel </Button>}
          { (readOnly || isNew) ? null : <Button mode="contained" onPress={ deleteBike }> Delete </Button>}
          { (readOnly && !isNew) ? <Button mode="contained" onPress={ maintenanceHistory }> History </Button> : null }
        {connectedToStrava() ? <Button
          mode="outlined"
          onPress={ viewOnStrava }
          accessibilityLabel="View on Strava"
          accessibilityHint="Open up the bike details on Strava">View on Strava
        </Button> : null}
      </Card>
    </Surface>
  )
};

export default BikeComponent;