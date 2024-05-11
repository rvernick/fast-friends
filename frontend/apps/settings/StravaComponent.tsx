import React, { useContext } from "react";
import { Input, Button } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import StravaController from "./StravaController";

export const StravaComponent = () => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new StravaController(appContext);
  const user = appContext.getUser();

  if (user == null || user.stravaId == null || user.stravaId.length == 0) {
    return <Button onPress={ () => controller.linkToStrava(user, appContext) } mt="2" colorScheme="indigo">
      Connect to Strava
    </Button>;
  }
  return (
    <Input
      isReadOnly={true}
      type="text"
      placeholder={user.stravaId}>SettingsScreen</Input>
    );
};
