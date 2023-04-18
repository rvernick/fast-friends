import React from "react";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { NativeBaseProvider } from 'native-base';
import { Login } from './apps/account/Login'
import { StyleSheet, Text, View } from 'react-native';
// import { BASE_URL } from '@env';

export default function App() {
  // console.log('Base url: ' + BASE_URL);
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>    <NativeBaseProvider >
      <Login />
    </NativeBaseProvider>
    </QueryClientProvider>

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