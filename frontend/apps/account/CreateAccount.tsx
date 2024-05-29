import React, { useContext, useState } from "react";
import { GlobalStateContext } from "../config/GlobalContext";
import CreateAccountController from './CreateAccountController';
import { EmailPasswordScreen } from "./EmailPasswordScreen";

export const CreateAccount = ({ navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new CreateAccountController(appContext);

  return (
    <EmailPasswordScreen
      controller={controller}
      navigation={navigation}/>
  );
};
