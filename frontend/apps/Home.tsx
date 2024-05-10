import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GlobalStateContext } from './config/GlobalContext';
import { SettingsStack } from './settings/SettingsStack';
import { StravaReplyScreen } from './settings/StravaReplyScreen';
import BikeListScreen from './strava/BikeListScreen';

const Tabs = createBottomTabNavigator();

export function Home() {
  const { appContext } = useContext(GlobalStateContext);

  console.log('home context: ' + appContext);
  return (
    <Tabs.Navigator>
      <Tabs.Screen name='Bikes' component={BikeListScreen}/>
      <Tabs.Screen name='Settings' component={SettingsStack}/>
      <Tabs.Screen name='StravaReply' component={StravaReplyScreen}/>
    </Tabs.Navigator> );
}

