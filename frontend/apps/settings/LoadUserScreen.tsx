import React, { useContext, useEffect } from "react";
import { Box, Heading, Input, Center } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import { useQuery, useQueryClient } from'@tanstack/react-query';
import SettingsController from "./SettingsController";

export const LoadUserScreen = ({ navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new SettingsController(appContext);
  const query = useQueryClient();
  const email = appContext.email;

  const { status, data, error, isFetching } = useQuery({
    queryKey: [email],
    queryFn: () => controller.getUser(email, appContext),
  })

  useEffect(() => {
    if (status === 'success' && data) {
      navigation.replace('SettingsScreen', {user: data})
    }
  }, [status]);

  if (status === 'error') {
    return (
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
            Fast Friends
          </Heading>
          <Heading mt="1" _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="xs">
            An error occured!
          </Heading>
        </Box>
      </Center>
    )
  }

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          Fast Friends
        </Heading>
        <Heading mt="1" _dark={{
        color: "warmGray.200"
      }} color="coolGray.600" fontWeight="medium" size="xs">
          Loading...
        </Heading>
      </Box>
    </Center>
  )
}