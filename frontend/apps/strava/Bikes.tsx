import React, { useContext } from 'react';
import { GlobalStateContext } from '../config/GlobalContext';
import BikeListScreen from './BikeListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BikeScreen } from './BikeScreen';

const Stack = createNativeStackNavigator();

export function Bikes() {
  const { appContext } = useContext(GlobalStateContext);

  return (
    <Stack.Navigator>
      <Stack.Screen name='BikeList' component={BikeListScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Bike' component={BikeScreen} options={{ headerShown: false }}/>
    </Stack.Navigator> );
}

