import React, { useContext, useState } from "react";
import { Box, Heading, VStack, FormControl, Input, Button, HStack, Center, WarningOutlineIcon } from "native-base";
import { GlobalStateContext } from "../config/GlobalContext";
import NewPasswordOnResetController from './NewPasswordOnResetController';
import { EmailPasswordScreen } from "./EmailPasswordScreen";

export const NewPasswordOnReset = ({ route, navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  console.log('create account context: ' + appContext);

  var token = '';
  if (route.params && 'token' in route.params) {
    console.log('tokenpt: ' + route.params.token);
    token = route.params.token;
  }
  const passwordResetController = new NewPasswordOnResetController(appContext, token);

  return (
    <EmailPasswordScreen
      controller={passwordResetController}
      navigation={navigation}/>
  );
};
