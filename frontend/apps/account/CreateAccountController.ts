import React, { ChangeEvent, useContext, useState } from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { GlobalStateContext } from "../config/GlobalContext";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";

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
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }

  verifyPasswords(password: string, confirmPassword: string) {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }


  async callCreateAccount(username: string, password: string) {
    const response = await fetch(this.appContext.baseUrl() + 'auth/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });
    if (response.ok) {
      return '';
    }
    const msg = await response.json(); 
    const message = await msg.message;
    console.log('message ' + message);
    console.log('msg ' + msg.message);
    return msg.message;
  }
};

export default CreateAccountController;