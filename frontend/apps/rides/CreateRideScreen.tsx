import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, NativeBaseProvider } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GestureResponderEvent, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { GlobalStateContext } from "../config/GlobalContext";
import { DateTimeSelection } from "../../components/DateTimeSelection";

export const CreateRideScreen = ({ navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  // const controller = new CreateRideController(appContext);

  // Title, Starttime, startlocation, groups, route, style]
  // default to tomorrow at 7:00 and the time picker works better
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 7, 0);
  const [title, setEnteredTitle] = useState('');
  const [startDateTime, setStartDateTime] = useState(defaultStart);


  const updateTitle = function(newText: string) {
    setEnteredTitle(newText);
  };

  const updateStartDateTime = function(e: Event, toDate: Date) {
    console.log("setting start date to: " + toDate);
    setStartDateTime(toDate);
  };

  const setStart = function(toDate: Date) {
    console.log("setting start date: " + toDate);
    setStartDateTime(toDate);
  }

  const submitRide = function(e: GestureResponderEvent) {
    e.preventDefault();
    console.log("submitting ride " + startDateTime + " " + title);
    // controller.submitRide(title, startTime);
  };

  return <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          Create Ride
        </Heading>

        <VStack space={3} mt="5">


          <FormControl isRequired>
            <FormControl.Label>Title</FormControl.Label>
            <Input onChangeText={updateTitle}/>
          </FormControl>
          <FormControl>
            <FormControl.Label>Start</FormControl.Label>
            <DateTimeSelection
              setter={setStart}
              value={startDateTime}
              minimumDate={new Date()}/>
          </FormControl>
          <Button
              onPress={submitRide} mt="2" colorScheme="indigo">
            Create Ride
          </Button>
        </VStack>
      </Box>
    </Center>;

};
