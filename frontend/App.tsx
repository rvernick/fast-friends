import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { NativeBaseProvider } from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import { GlobalStateProvider } from "./apps/config/GlobalContext";
import { Root } from "./apps/Root";
import { NavigationContainer } from "@react-navigation/native";
// import { BASE_URL } from '@env';

const queryClient = new QueryClient()

export default function App() {
  // console.log('Base url: ' + BASE_URL);
  // const queryClient = new QueryClient();

  return (
    <GlobalStateProvider>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider >
          <NavigationContainer>
            <Root />
          </NavigationContainer>
        </NativeBaseProvider>
      </QueryClientProvider>
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