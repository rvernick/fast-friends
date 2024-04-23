import { NativeBaseProvider } from 'native-base';
import { GlobalStateProvider } from "./config/GlobalContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';


export const wrapForRender = (component) => {
  const Stack = createNativeStackNavigator();
  const queryClient = new QueryClient()
  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  return (
    <GlobalStateProvider>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider initialWindowMetrics={inset} >
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="CreateAccount" component={component} />
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </QueryClientProvider>
    </GlobalStateProvider>
  );
};
