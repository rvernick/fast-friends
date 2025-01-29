import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView } from "react-native";
import { useGlobalContext } from "../../common/GlobalContext";
import SettingsController from "./SettingsController";
import { ensureString, forget, isMobile } from '../../common/utils';
import StravaController from "./StravaController";
import { ActivityIndicator, Button, Card, List, Surface, Text } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "@/common/ctx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser } from "../../common/utils";
import { createStyles, defaultWebStyles } from "@/common/styles";


export const GettingStartedComponent = () => {
  const session = useSession();
  const { strava_id } = useLocalSearchParams();
  const [providedStravaId, setProvidedStravaId] = useState(ensureString(strava_id));

  const queryClient = useQueryClient();
  const email = session.email ? session.email : '';
  const appContext  = useGlobalContext();
  appContext.setSession(session);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileErrorMessage, setMobileErrorMessage] = useState('');
  const [warnAgainstLinking, setWarnAgainstLinking] = useState(false);
  const [warnAgainstDeleting, setWarnAgainstDeleting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccessful, setSaveSuccessful] = useState(false);
  const [warnOnLosingData, setWarnOnLosingData] = useState(false);
  const [linkToStravaExpanded, setLinkToStravaExpanded] = React.useState(true);

  const handlePress = () => setLinkToStravaExpanded(!linkToStravaExpanded);

  const controller = new SettingsController(appContext);
  const stravaController = new StravaController(appContext);
  
  const dimensions = Dimensions.get('window');
  const useStyle = isMobile() ? createStyles(dimensions.width, dimensions.height) : defaultWebStyles
  
  const blankUser = {username: email,
    firstName: '',
    lastName: '',
    cellPhone: '',
    stravaId: providedStravaId,
    units: "miles",
    pushToken: '' };
  const { status, data, error, isFetching } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser(session, email),
    initialData: blankUser,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
  });

  const invalidateUser = () => {
    console.log('Invalidate user: ' + email);
    queryClient.removeQueries({queryKey: ['user']});
    queryClient.removeQueries({ queryKey: ['bikes'] });
    forget("ff.preferences");
    setIsDirty(false);
  }
  
  const [stravaId, setStravaId] = useState('');
  // const [units, setUnits] = useState(data?.units);


  const validate = () => {
    return true;
  }

  const dirty = () => {
    setIsDirty(true);
  }

  // const updateAccount = async function() {
  //   if (!validate()) {
  //     console.log('Not valid');
  //     return;
  //   }
  //   const response = await controller.updateAccount(session, email, firstName, lastName, cellPhone, ensureString(units));
  //   if (response === '') {
  //     setSaveSuccessful(true);
  //     setIsDirty(false);
  //     invalidateUser();
  //     setErrorMessage('');
  //   } else {
  //     setErrorMessage(response);
  //   }
  // };

  const linkToStrava = async () => {
    if (isMobile()) {
      setWarnAgainstLinking(true);
      return;
    }
    if (isDirty) {
      if (validate()) {
        setWarnOnLosingData(true);
      }
    } else {
      doLinkToStrava();
    }
  }

  const doLinkToStrava = async () => {
    await stravaController.linkToStrava(session);
    setStravaId('Connecting to Strava...');
    invalidateUser();
  }
  
  const userUpdated = async () => {
    if (isDirty) {
      return;
    }
    syncUser();
  }

  const syncUser = async () => {
    if (providedStravaId.length > 0) {
      setStravaId(providedStravaId);
    } else {
      const userStravaId = ensureString(data?.stravaId);
      setStravaId(userStravaId);
    }
    // const newUnits = data?.units == "km" ? "km" : "miles";
    // setUnits(newUnits);
  }

  // useEffect(() => {
  //   try {
  //     userUpdated();
  //   } catch (error) {
  //     console.error('Error updating user', error);
  //   }
  // }, [data, isFetching]);

  return (
    <Surface style={useStyle.containerScreen}>
      {isFetching ? <ActivityIndicator  size="large"/> : null}
      <ScrollView contentContainerStyle={{flexGrow:1}} style={useStyle.containerBody}>
      {/* title={<Text style={{textAlign: "center"}} variant="headlineMedium">Using Pedal Assistant </Text>} */}
        {/* title={<Text style={{textAlign: "center"}} variant="headlineMedium">Using Pedal Assistant </Text>} */}
      <Text style={{textAlign: "center"}} variant="headlineMedium">Using Pedal Assistant </Text>
      {/* <Text style={{textAlign: "left"}}>For easiest use we recommend you:</Text> */}
    <List.Section >
      <List.Accordion
        title="1) Link To Strava"
        expanded={linkToStravaExpanded}
        onPress={handlePress}>
        <List.Item title={<Button
            icon={() =>
            <Image
              source={ require("../../assets/images/btn_strava_connectwith_orange.png")}
              // source={ require("../../assets/images/btn_strava_connectwith_orange.png")}
              style={{ width: 196, height: 48}}
              />}
            onPress={ linkToStrava }
            disabled={stravaId.length > 0}
            accessibilityLabel="Link to Strava"
            accessibilityHint="Login to Strava account">
              Press to link
          </Button>} />
          <List.Item title="Click link" description="This will link your bikes and start a maintenance schedule for each bike"/>
          <List.Item title="Authorize" description="Allow Pedal Assistant access to your bikes and rides on Strava"/>
          <List.Item title="Pedal Assistant will sync" description="Pedal Assistant will sync the mileage of your bikes and notify you when maintenance is due"/>
          <List.Item title="Ride" description="You can disconnect from Strava at anytime"/>
      </List.Accordion>

      <List.Accordion
        title="2) Edit Maintenance Schedule">
        <List.Item title={<Button
            mode="contained"
            onPress={() => router.push('/(home)/(maintenanceItems)/maintenance')}
            accessibilityLabel="Edit Maintenance Schedule"
            accessibilityHint="Edit Maintenance Schedule">
              Edit Maintenance Schedule
          </Button>} />
          <List.Item title="Click link" description="This will bring you to your bikes and maintenance schedule"/>
          <List.Item title="Add/Update Maintenance Items" description="A maintenance item can be an action of: Replace, Lubricate, Clean or Check"/>
          <List.Item title="Check Parts" description="A maintenance item can be on a part like: Chain, Front Tire, Rear Brake Pads, Bar Tape, etc."/>
          <List.Item title="Set intervals" description="A maintenance item can be scheduled by mileage or days between actions"/>
      </List.Accordion>
      <List.Accordion
        title="3) Log Maintenance">
        <List.Item title={<Button
            mode="contained"
            onPress={() => router.push('/(home)/(maintenanceItems)/log-maintenance')}
            accessibilityLabel="Log Maintenance"
            accessibilityHint="Log Maintenance">
              Log Maintenance
          </Button>} />
          <List.Item title="Click link" description="This will bring you to a page to log maintenance done"/>
          <List.Item title="Check work done" description="Click the check box at the right of the screen for work done"/>
          <List.Item title="Update deadline" description="The left column indicates the when the the work will need to be done next"/>
          <List.Item title="Ride" description="Get back out there.  We'll alert you when your bike needs some TLC"/>
      </List.Accordion>
    </List.Section>

      {/* <Card>

          <Text style={{textAlign: "left"}}>For each part of your bikes, you can schedule maintenance actions of: Replace, Lubricate, Clean or Check.</Text>
          <Text style={{textAlign: "left"}}>Parts are: Chain, Front Tire, Rear Brake Pads, Bar Tape, etc.</Text>
          <Text style={{textAlign: "left"}}>We recommend scheduling maintenance for parts that you regularly take care of and want reminders or a history kept.</Text>

        <Card.Title titleVariant="titleLarge" title="1) Link To Strava"/>
        <Card.Content>
          <Button
            icon={() =>
            <Image
              source={ require("../../assets/images/btn_strava_connectwith_orange.png")}
              // source={ require("../../assets/images/btn_strava_connectwith_orange.png")}
              style={{ width: 196, height: 48}}
              />}
            onPress={ linkToStrava }
            disabled={stravaId.length > 0}
            accessibilityLabel="Link to Strava"
            accessibilityHint="Login to Strava account">
              Press to link
          </Button>
          <Text style={{textAlign: "left"}}>This will link you bikes and start a maintenance schedule for each bike.</Text>
          <Text style={{textAlign: "left"}}>Pedal Assistant will sync the mileage of your bikes and notify you when maintenance is due.</Text>
          <Text style={{textAlign: "left"}}>You can also disconnect your bikes from Strava at any time.</Text>
        </Card.Content>.
      </Card> */}
      {/* <Card>
        <Card.Title titleVariant="titleLarge" title="2) Edit Maintenance Schedule"/>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => router.push('/(home)/(maintenanceItems)/maintenance')}
            accessibilityLabel="Edit Maintenance Schedule"
            accessibilityHint="Edit Maintenance Schedule">
              Edit Maintenance Schedule
          </Button>
        </Card.Content>.
      </Card> */}
      {/* <Card>
        <Card.Title titleVariant="titleLarge" title="1) Link To Strava"/>
        <Card.Content>
          <Button
            icon={() =>
            <Image
              source={ require("../../assets/images/btn_strava_connectwith_orange.png")}
              // source={ require("../../assets/images/btn_strava_connectwith_orange.png")}
              style={{ width: 196, height: 48}}
              />}
            onPress={ linkToStrava }
            disabled={stravaId.length > 0}
            accessibilityLabel="Link to Strava"
            accessibilityHint="Login to Strava account">
              Press to link
          </Button>
          <List.Section>
            <List.Item title="Click link" description="This will link your bikes and start a maintenance schedule for each bike"/>
            <List.Item title="Authorize" description="Allow Pedal Assistant access to your bikes and rides on Strava"/>
            <List.Item title="Pedal Assistant will sync" description="Pedal Assistant will sync the mileage of your bikes and notify you when maintenance is due"/>
            <List.Item title="Ride" description="You can disconnect from Strava at anytime"/>
          </List.Section>          
        </Card.Content>
        </Card>
      <Card>
        <Card.Title titleVariant="titleLarge" title="2) Edit Maintenance Schedule"/>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => router.push('/(home)/(maintenanceItems)/maintenance')}
            accessibilityLabel="Edit Maintenance Schedule"
            accessibilityHint="Edit Maintenance Schedule">
              Edit Maintenance Schedule
          </Button>
          <List.Section>
            <List.Item title="Click link" description="This will link your bikes and start a maintenance schedule for each bike"/>
            <List.Item title="Authorize" description="Allow Pedal Assistant access to your bikes and rides on Strava"/>
            <List.Item title="Pedal Assistant will sync" description="Pedal Assistant will sync the mileage of your bikes and notify you when maintenance is due"/>
            <List.Item title="Ride" description="You can disconnect from Strava at anytime"/>
          </List.Section>          
          <Text style={{textAlign: "left"}}>For each part of your bikes, you can schedule maintenance actions of: Replace, Lubricate, Clean or Check.</Text>
          <Text style={{textAlign: "left"}}>Parts are: Chain, Front Tire, Rear Brake Pads, Bar Tape, etc.</Text>
          <Text style={{textAlign: "left"}}>We recommend scheduling maintenance for parts that you regularly take care of and want reminders or a history kept.</Text>
        </Card.Content>
        </Card>
      <Card>
        <Card.Title titleVariant="titleLarge" title="3) Log Maintenance"/>
        <Card.Content>
          <Text style={{textAlign: "left"}}>For each part of your bikes, you can schedule maintenance actions of: Replace, Lubricate, Clean or Check.</Text>
          <Text style={{textAlign: "left"}}>Parts are: Chain, Front Tire, Rear Brake Pads, Bar Tape, etc.</Text>
          <Text style={{textAlign: "left"}}>We recommend scheduling maintenance for parts that you regularly take care of and want reminders or a history kept.</Text>
        </Card.Content>
      </Card> */}
      </ScrollView>
    </Surface>
  )
};
