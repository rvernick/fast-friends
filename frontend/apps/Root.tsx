import React, { useContext, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './Home';
import { LoginScreen } from './account/LoginScreen';
import { PasswordReset } from './account/PasswordReset';
import { GlobalStateContext } from './config/GlobalContext';
import { CreateAccount } from './account/CreateAccount';
import { NewPasswordOnReset } from './account/NewPasswordOnReset';
import { StravaReplyScreen } from './settings/StravaReplyScreen';
import { NotFoundScreen } from './account/NotFoundScreen';

const Stack = createNativeStackNavigator();

export function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { appContext } = useContext(GlobalStateContext);

  const loggedInState = (val) => {
    setIsLoggedIn(val)
  }

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
        <Stack.Screen name='StravaReply' component={StravaReplyScreen}/>
        <Stack.Screen name='NotFound' component={NotFoundScreen}/>
      </Stack.Navigator>
    )
  }
};