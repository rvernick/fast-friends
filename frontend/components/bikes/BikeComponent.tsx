import React, { useEffect, useState } from "react";
import BikeController from "./BikeController";
import { useGlobalContext } from "@/common/GlobalContext";
import { Bike } from "@/models/Bike";
import { router, useNavigation } from "expo-router";
import { Button, Checkbox, HelperText, TextInput, ActivityIndicator, Card, Surface, Text, Tooltip } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { useSession } from "@/common/ctx";
import { displayStringToMeters, ensureString, fetchUser, isMobile, metersToDisplayString } from "@/common/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Dimensions, Linking } from "react-native";
import { createStyles, defaultWebStyles } from "@/common/styles";

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
      isRetired: false,
  }
type BikeProps = {
  bikeid: number
};

const BikeComponent: React.FC<BikeProps> = ({bikeid}) => {
  const session = useSession();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const appContext = useGlobalContext();

  const email = session.email ? session.email : '';

  var bikeId = bikeid ? bikeid : 0;

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
  const [milageLabel, setMileageLabel] = useState('Mileage');
  const [isRetired, setIsRetired] = useState(newBike.isRetired);

  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles

  const controller = new BikeController(appContext);
  const preferences = controller.getUserPreferences(session);

  const editOrDone = (value: any) => {
    if (!readOnly) {
      updateBike();
    } else {
      setReadOnly(false);
    }
  }

  const resetBike = async (bike: Bike) => {
    const pref = await preferences
    setMileageLabel('Mileage (' + pref.units + ')');
    console.log('reset bike: ' + JSON.stringify(bike));
    setBikeName(ensureString(bike.name));
    navigation.setOptions({ title: ensureString(bike.name) });
    setType(ensureString(bike.type));
    setGroupsetBrand(ensureString(bike.groupsetBrand));
    setSpeeds(ensureString(bike.groupsetSpeed));
    setIsElectronic(bike.isElectronic);
    setIsRetired(bike.isRetired);
    setMileage(metersToDisplayString(bike.odometerMeters, pref));
    setStravaId(ensureString(bike.stravaId));
    setReadOnly(true);
  }

  const goBack = () => {  // maybe in AppController?
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(home)');
    }
  }

  const updateBike = async function() {
    const result = await controller.updateBike(session, email, bikeId,
      bikeName,
      displayStringToMeters(milage, await preferences),
      type,
      groupsetBrand,
      speed,
      isElectronic,
      isRetired);
    console.log('update bike result: ' + result);
    queryClient.invalidateQueries({ queryKey: ['bikes'] });
    if (result == '') {
      goBack();
    } else {
      setErrorMessage(result);
    }
  };

  const deleteBike = async function() {
    setErrorMessage('');
    const result = await controller.deleteBike(session, email, bikeId);
    queryClient.invalidateQueries({ queryKey: ['bikes'] });
    if (result == '') {
      goBack();
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
      controller.getBike(session, bikeId, email).then(bike => {
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
    var bikeUri = 'strava://bikes/' + idWithoutTheB;
    var gearUri = 'strava://gear/';
    var url = `https://www.strava.com/bikes/${idWithoutTheB}`;

    if (isMobile() && await attemptToLinkToStravaApp()) {
      return;
    } 

    Linking.openURL(url).catch(err => console.error('Error opening strava link: ', err));
  }

  const attemptToLinkToStravaApp = async () => {
    var idWithoutTheB = stravaId.replace('b', '');
    var bikeUri = 'strava://bikes/' + idWithoutTheB;
    var gearUri = 'strava://gear/';

    const user = await fetchUser(session, ensureString(session.email));
    if (user && user.stravaId!= null && user.stravaId!= '') {
      gearUri = 'strava://athletes/' + user.stravaId + '/gear';
      if (await Linking.canOpenURL(gearUri)) {
        Linking.openURL(gearUri).catch(err => console.error('Error opening strava link: ', err));
        return true;
      } else {
        if (await Linking.canOpenURL(bikeUri)) {
          Linking.openURL(gearUri).catch(err => console.error('Error opening strava link: ', err));
          return true;
        }
      }
    }

    return false;
  }

  const groupsetOptions = groupsetBrands.map(brand => ({ label: brand, value: brand }));
  const speedOptions = groupsetSpeeds.map(speed => ({ label: speed, value: speed}));
  const typeOptions = types.map(type => ({ label: type, value: type }));

  return (
    <Surface style={useStyle.containerScreen}>
      <Card>
        {!isInitialized ? <ActivityIndicator animating={!isInitialized} size="large"/> : null }
        <TextInput label="Name" readOnly={readOnly}
          value={bikeName}
          onChangeText={updateName}
          disabled={readOnly}
          placeholder="Name"
          testID="nameInput"
          accessibilityLabel="Bike Name"
          accessibilityHint="Name of the bike" />
        <HelperText type="error" >{errorMessage}</HelperText>
        <TextInput label={milageLabel}
          disabled={readOnly || connectedToStrava()}
          value={milage}
          onChangeText={(value) => setMileage(value ? value : '')}
          inputMode="numeric"
          testID="mileageField"
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
        <Tooltip title={"Retired: No longer in use.  Suspend maintenance tracking"}>
          <Checkbox.Item label="Retired"
            disabled={readOnly}
            status={isRetired ? "checked" : "unchecked"} 
            onPress={values => setIsRetired(!isRetired)}
            accessibilityLabel="Bike is Retired"/>
        </Tooltip>
      </Card>
      
      <Surface style={useStyle.bottomButton}>
        <Button mode="contained"
          onPress={ editOrDone }
          style={{flex: 1}}
          accessibilityLabel="Finished editing"
          accessibilityHint="Will save any changes and go back">
          { readOnly? 'Edit' : 'Done' }
        </Button>
        { (readOnly || isNew) ? null : <Button mode="contained" style={{flex: 1}} onPress={ cancel }> Cancel </Button>}
        { (readOnly || isNew) ? null : <Button mode="contained" style={{flex: 1}} onPress={ deleteBike }> Delete </Button>}
        { (readOnly && !isNew) ? <Button mode="contained" style={{flex: 1}} onPress={ maintenanceHistory }> History </Button> : null }
        {(connectedToStrava() && readOnly &&!isNew ) ?
          <Tooltip title={"View Strava: Will open the bike details on Strava"}>
            <Button
            mode="outlined"
            style={{flex: 1}}
            onPress={ viewOnStrava }
            accessibilityLabel="View on Strava"
            accessibilityHint="Open up the bike details on Strava">View on Strava
          </Button>
        </Tooltip> : null}
      </Surface>
    </Surface>
  )
};

export default BikeComponent;