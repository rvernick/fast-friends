import React, { useContext } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";import { GlobalStateContext } from "../config/GlobalContext";
import StravaController from "./StravaController";

export const StravaReplyScreen = ({ route, navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new StravaController(appContext);
  const email = appContext.email;

  console.log('email: ' + email);

  if (route.params.error) {
    return errorConnecting(route.params, navigation);
  }

  if (route.params.code) {
    controller.updateStravaCode(appContext, route.params.code);
  }
  
  console.log('create account context: ' + appContext);
  console.log('route: ' + route);
  console.log('error: ' + route.params.error);
  console.log('route: ' + route.params);
  console.log('state: ' + route.params.state);
  console.log('scope: ' + route.params.scope);
  console.log('code: ' + route.params.code);

};

const errorConnecting = function(route, navigation) {
  return <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          Strava Connected!
        </Heading>
        <Heading mt="1" _dark={{
        color: "warmGray.200"
      }} color="coolGray.600" fontWeight="medium" size="xs">
          {route.params.state} {route.params.error}
        </Heading>

        <VStack space={3} mt="5">
          <HStack mt="6" justifyContent="center">
            <Button
              variant={'ghost'}
              onPress={() => navigation.replace('Settings')}
              testID="createAccountButton">
                Return to Settings
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>;
};