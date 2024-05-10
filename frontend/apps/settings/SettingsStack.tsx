import React, { useContext, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalStateContext } from '../config/GlobalContext';
import { SettingsScreen } from './SettingsScreen';
import { ChangePassword } from './ChangePassword';
import { LoadUserScreen } from './LoadUserScreen';

const Stack = createNativeStackNavigator();

export function SettingsStack() {
  const { appContext } = useContext(GlobalStateContext);

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='SettingsScreen' component={SettingsScreen}/>
        <Stack.Screen name='LoadUser' component={LoadUserScreen}/>
        <Stack.Screen name='ChangePassword' component={ChangePassword}/>
      </Stack.Navigator>
  );
}

