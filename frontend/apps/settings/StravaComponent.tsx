import React, { useContext } from "react";
import { Input, Button } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import StravaController from "./StravaController";

export const StravaComponent = ({ user }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new StravaController(appContext);

  if (user.stravaId === null || user.stravaId.length === 0) {
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
