import React, { useContext, useEffect } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon, Spinner } from "native-base";import { GlobalStateContext } from "../config/GlobalContext";
import StravaController from "./StravaController";

export const StravaReplyScreen = ({ loggedInMonitor, route, navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new StravaController(appContext);
  const email = appContext.getEmail();

  console.log('email: ' + email);

  console.log('create account context: ' + appContext);
  console.log('route: ' + route);
  console.log('error: ' + route.params.error);
  console.log('route: ' + route.params);
  console.log('state: ' + route.params.state);
  console.log('scope: ' + route.params.scope);
  console.log('code: ' + route.params.code);

const refresh = () => {
  if (appContext.isLoggedIn()) {
    console.log('refreshing is logged in');
  } else {
    console.log('refreshing...' + window.parent.location.origin);
    console.log(window.parent);
    window.parent.location = window.parent.location.origin;
  }
};

var message = 'Updating your Strava settings...';
if (route.params.error) {
  message = 'Strava Connection returned: ' + route.params.error;
}

const updateStravaAndReturn = async (code: string) => {
  await controller.updateStravaCode(appContext, code);
  console.log('updated strava code: ');
  appContext.isLoggedInPromise()
    .then((isLoggedIn) => {
      if (isLoggedIn) {
        console.log(' updating loggedin monitor ');
        loggedInMonitor(true);
      }
    });
}

useEffect(() => {
  console.log('StravaReplyScreen useEffect: ' + JSON.stringify(route));
  console.log('navigation: ' + JSON.stringify(navigation));
  if (route.params.code) {
    updateStravaAndReturn(route.params.code);
  } else {
    console.log('no code found');
  }
});

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
         {message}
        </Heading>
        <Heading mt="1" _dark={{
        color: "warmGray.200"
      }} color="coolGray.600" fontWeight="medium" size="s">
         {message}
        </Heading>
        <Spinner/>
        <VStack space={3} mt="5">
          <HStack mt="6" justifyContent="center">
            <Button
              variant={'ghost'}
              onPress={refresh}
              testID="createAccountButton">
                Return to Settings
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>
    );
  };

  // loggedInMonitor(true);