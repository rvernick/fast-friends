import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GlobalStateContext } from './config/GlobalContext';
import { SettingsStack } from './settings/SettingsStack';

const Tabs = createBottomTabNavigator();

export function Home() {
  const { appContext } = useContext(GlobalStateContext);

  console.log('home context: ' + appContext);
  return (
    <Tabs.Navigator>
      <Tabs.Screen name='Settings' component={SettingsStack}/>
    </Tabs.Navigator> );
}

