import { router, Slot } from 'expo-router';
import { SessionProvider } from "@/common/ctx";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";

import { Colors } from "../constants/Colors";
import { useColorScheme } from 'react-native';
import { GlobalStateProvider } from '@/common/GlobalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from 'react-native-error-boundary';
import { NotificationProvider } from '@/common/NotificationContext';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import "@/constants/global.css";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

const onError = (error: Error, stackTrace: string) => {
  console.error(error, stackTrace);
};

const retry = async () => {
  console.log('Retrying... after an error occurred');
  router.replace('/');
}

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const colorScheme = systemColorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  const queryClient = new QueryClient();
  
  console.log(systemColorScheme);
  return (
    <ErrorBoundary onError={onError}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <NotificationProvider>
            <GlobalStateProvider>
              <ThemeProvider value={colorScheme}>
                <GluestackUIProvider mode={systemColorScheme === 'dark' ? 'dark' : 'light'}>
                  <PaperProvider theme={colorScheme}> 
                    <Slot />
                  </PaperProvider>
                </GluestackUIProvider>
              </ThemeProvider>
            </GlobalStateProvider>
          </NotificationProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
