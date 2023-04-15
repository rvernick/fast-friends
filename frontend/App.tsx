import React from "react";
import { NativeBaseProvider } from 'native-base';
import { Login } from './apps/account/Login'
import { StyleSheet, Text, View } from 'react-native';
// import { BASE_URL } from '@env';

export default function App() {
  // console.log('Base url: ' + BASE_URL);
  return (
    <NativeBaseProvider >
      <Login />
    </NativeBaseProvider>
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