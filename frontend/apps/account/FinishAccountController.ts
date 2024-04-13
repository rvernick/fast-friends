import React, { ChangeEvent, useContext, useState } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { GlobalStateContext } from "../config/GlobalContext";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { strippedPhone } from "./utils";

class FinishAccountController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  public updateAccount(username: string, firstName: string, lastName: string, mobile: string) {
    return this.callUpdateAccount(
      username,
      firstName,
      lastName,
      strippedPhone(mobile));
  }

  async callUpdateAccount(username: string,
    firstName: string,
    lastName: string,
    mobile: string) {

    try {
      const body = JSON.stringify({
        username: username,
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
      });

      const response = await this.post('auth/update-user', body);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Update Account';
    }
  }
};

export default FinishAccountController;