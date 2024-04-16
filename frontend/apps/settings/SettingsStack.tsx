import React, { useContext, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalStateContext } from '../config/GlobalContext';
import { SettingsScreen } from './SettingsScreen';
import { ChangePassword } from './ChangePassword';

const Stack = createNativeStackNavigator();

export function SettingsStack() {
  const { appContext } = useContext(GlobalStateContext);

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='SettingsHome' component={SettingsScreen}/>
        <Stack.Screen name='ChangePassword' component={ChangePassword}/>
      </Stack.Navigator>
  );
}

