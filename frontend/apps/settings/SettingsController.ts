import React, { ChangeEvent, useContext, useState } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { GlobalStateContext } from "../config/GlobalContext";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { strippedPhone } from "../common/utils";
import { get, post } from "../common/http_utils";

class SettingsController extends AppController {
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
      const body = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
      };

      const response = await post('/auth/update-user', body, this.appContext.getJwtTokenPromise());
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

  getUser = (username: string, appContext: AppContext): Promise<Object>  => {
    console.log('getting user:' + username);
    console.log(appContext);
    console.log(appContext.getJwtToken());
    try {
      const parameters = {
        username: username,
      };
      return get('/auth/user', parameters, appContext.getJwtTokenPromise());
    } catch(e: any) {
      console.log(e.message);
      return null;
    }
  }
};


export default SettingsController;