import {Slot, Stack} from 'expo-router';
import { SessionProvider } from "../ctx";
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

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const colorScheme = systemColorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;

  console.log(systemColorScheme);
  return (
    <PaperProvider theme={colorScheme}> 
      <ThemeProvider value={colorScheme}>
        <GlobalStateProvider>
          <SessionProvider>
            <Slot />
          </SessionProvider>
        </GlobalStateProvider>
      </ThemeProvider>
    </PaperProvider>
  )
}
