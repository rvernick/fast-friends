import React, { useContext, useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './Home';
import { LoginScreen } from './account/LoginScreen';
import { PasswordReset } from './account/PasswordReset';
import { GlobalStateContext } from './config/GlobalContext';
import { CreateAccount } from './account/CreateAccount';
import { NewPasswordOnReset } from './account/NewPasswordOnReset';
import { NotFoundScreen } from './account/NotFoundScreen';
import { StravaReplyScreen } from './settings/StravaReplyScreen';

const Stack = createNativeStackNavigator();

export function Root() {
  const { appContext } = useContext(GlobalStateContext);
  const [isLoggedIn, setIsLoggedIn] = useState(appContext.isLoggedIn());

  const loggedInState = (val) => {
    setIsLoggedIn(val)
  }

  useEffect(() => {
    if (isLoggedIn && appContext.hasLoginExpired()) {
      console.log('login expired');
      loggedInState(false);
    }
  });

  if (isLoggedIn) {
    return (<Home/>);
  } else {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login">
          {(props) => <LoginScreen  {...props} loggedInMonitor={loggedInState} />}
        </Stack.Screen>
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="ResetPassword" component={PasswordReset} />
        <Stack.Screen name="NewPasswordOnReset" component={NewPasswordOnReset} />
        <Stack.Screen name='NotFound' component={NotFoundScreen}/>
        <Stack.Screen name='StravaReply'>
          {(props) => <StravaReplyScreen  {...props} loggedInMonitor={loggedInState} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }
};