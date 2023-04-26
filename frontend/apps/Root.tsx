import React, { useContext, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './Home';
import { LoginScreen } from './account/LoginScreen';
import { GlobalStateContext } from './config/GlobalContext';
import { CreateAccount } from './account/CreateAccount';

const Stack = createNativeStackNavigator();

export function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { appContext } = useContext(GlobalStateContext);
  appContext.isLoggedInWatcher(setIsLoggedIn);

  if (!isLoggedIn) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
      </Stack.Navigator>
    )
  }
  return ( <Home/> );
}

