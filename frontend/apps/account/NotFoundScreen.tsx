import React, { useContext } from "react";
import { Box, Heading, VStack, Button, Center, FormControl, Input } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";

export const NotFoundScreen = ({ route, navigation }) => {
  const { appContext } = useContext(GlobalStateContext);

  return <Center w="100%">
  <Box safeArea p="2" py="8" w="90%" maxW="290">
    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
    color: "warmGray.50"
    }}>
      Fast Friends
    </Heading>
    <Heading mt="1" _dark={{
    color: "warmGray.200"
  }} color="coolGray.600" fontWeight="medium" size="xs">
      Path Not Found: {route.path}
    </Heading>
    <VStack space={3} mt="5">
    <FormControl/>
    <Button
      onPress={() => window.parent.location = window.parent.location.origin} mt="2" colorScheme="indigo">
      Return to Application
    </Button>
    </VStack>
  </Box>
</Center>;
};
