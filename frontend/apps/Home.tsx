import React, { ChangeEvent, useContext, useState } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { GestureResponderEvent, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { GlobalStateContext } from './config/GlobalContext';

export const Home = () => {
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
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isRequired>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Password</FormControl.Label>
            <Input 
              type="password"
              />
          </FormControl>
          <Button>
            Home
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
              Home Screen{" "}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Center>;
};
