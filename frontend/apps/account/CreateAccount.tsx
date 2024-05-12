import React, { useContext, useState } from "react";
import { GlobalStateContext } from "../config/GlobalContext";
import CreateAccountController from './CreateAccountController';
import { EmailPasswordScreen } from "./EmailPasswordScreen";

export const CreateAccount = ({ navigation }) => {
  const { appContext } = useContext(GlobalStateContext);
  const controller = new CreateAccountController(appContext);

  console.log('create account context: ' + appContext);

  return (
    <EmailPasswordScreen
      controller={controller}
      navigation={navigation}/>
  );
};
