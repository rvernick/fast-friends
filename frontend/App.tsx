import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import { GlobalStateProvider } from "./apps/config/GlobalContext";
import { Root } from "./apps/Root";
import { NavigationContainer } from "@react-navigation/native";
// import { BASE_URL } from '@env';

const queryClient = new QueryClient()

const config = {
  screens: {
    NewPasswordOnReset: 'new-password-on-reset',
    StravaReply: 'strava-reply',
    Settings: 'Settings',
    Login: 'Login',
    NotFound: '*',
  },
};
const linking = {
  prefixes: ['fastfriends://', 'https://fastfriends.biz'],
  config,
};


export default function App() {
  // console.log('Base url: ' + BASE_URL);
  // const queryClient = new QueryClient();

  return (
    <GlobalStateProvider>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider theme={theme} >
          <NavigationContainer linking={linking}>
            <Root />
          </NavigationContainer>
        </NativeBaseProvider>
      </QueryClientProvider>
    </GlobalStateProvider>
  );
}

// https://smart-swatch.netlify.app/#805ad5
const theme = extendTheme({
  colors: {
    primary: {
      50: '#f0eaff',
      100: '#d1c1f4',
      200: '#b199e7',
      300: '#9171dc',
      400: '#7248d0',
      500: '#592fb7',
      600: '#45248f',
      700: '#311968',
      800: '#1e0f40',
      900: '#0c031b',
    },
    primaryDark: {
      900: '#f0eaff',
      800: '#d1c1f4',
      700: '#b199e7',
      600: '#9171dc',
      500: '#7248d0',
      400: '#592fb7',
      300: '#45248f',
      200: '#311968',
      100: '#1e0f40',
      50: '#0c031b',
    },
  },
});