import React, { ChangeEvent, useContext, useState } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { GlobalStateContext } from "../config/GlobalContext";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { isValidPassword, invalidPasswordMessage } from "../common/utils";
import { post } from '../common/http_utils';

class CreateAccountController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  public createAccount(username: string, password: string) {
    this.verifyEmail(username);
    this.verifyPassword(password);
    return this.callCreateAccount(username, password);
  }

  verifyEmail(email: string) {
    if (!email.includes('@') || !email.includes('.')) {
      return 'Please enter valid email';
    }
    return '';
  }

  verifyPassword(password: string) {
    if (!isValidPassword(password)) {
      return invalidPasswordMessage;
    }
    return '';
  }

  verifyPasswords(password: string, confirmPassword: string) {
    if (password!== confirmPassword || !isValidPassword(password)) {
      return invalidPasswordMessage;
    }
    return '';
  }

  async callCreateAccount(username: string, password: string) {
    try {
      const body = JSON.stringify({
        username: username,
        password: password,
      });

      const response = await post('auth/create', body, null);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Create Account';
    }
  }
};

export default CreateAccountController;