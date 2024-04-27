import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import StravaController from "./StravaController";

export const StravaComponent = ({ user }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new StravaController(appContext);
  const email = appContext.email;

  if (user.stravaId == null) {
    return <Button onPress={ () => controller.linkToStrava(user, appContext) } mt="2" colorScheme="indigo">
      Connect to Strava
    </Button>;
  } else {
    return
      <Input
        isReadOnly={true}
        type="text"
        placeholder={user.stravaId}>SettingsScreen</Input>;
  }
};
