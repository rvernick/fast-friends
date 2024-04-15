import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import ChangePasswordController from "./ChangePasswordController";

export const SettingScreen = ({ navigation }) => {
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
          Settings
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isReadOnly={true} isDisabled={true}>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input isReadOnly={true}
              type="text"
              placeholder={appContext.email}/>
          </FormControl>
         <Button onPress={ () => navigation.push('ChangePassword') } mt="2" colorScheme="indigo">
            Update Password
          </Button>
        </VStack>
      </Box>
    </Center>;
};
