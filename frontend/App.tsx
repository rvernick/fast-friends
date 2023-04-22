import React, { useContext } from "react";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { NativeBaseProvider } from 'native-base';
import { Login } from './apps/account/Login'
import { StyleSheet, Text, View } from 'react-native';
import { GlobalStateContext, GlobalStateProvider } from "./config/GlobalContext";
// import { BASE_URL } from '@env';

export default function App() {
  // console.log('Base url: ' + BASE_URL);
  // const queryClient = new QueryClient();

  return (
    <GlobalStateProvider>
      <NativeBaseProvider >
        <Login />
      </NativeBaseProvider>
    </GlobalStateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});