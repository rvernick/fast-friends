import { GlobalStateProvider } from "../common/GlobalContext";
import { QueryClient } from '@tanstack/react-query';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, ThemeProvider } from "react-native-paper";
import { SessionProvider } from "../ctx";

import { Colors } from "../constants/Colors";
import { useColorScheme } from 'react-native';
import { ReactNode } from "react";

interface ProviderWrapperProps {
  children: ReactNode;
}

export const ProviderWrapper = ({ children }: ProviderWrapperProps) => {
  const systemColorScheme = useColorScheme();
  const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
  const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

  const colorScheme = systemColorScheme === 'dark' ? customDarkTheme : customLightTheme;

  const queryClient = new QueryClient();
  const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  return (
    <PaperProvider theme={colorScheme}> 
      <SessionProvider>
        <GlobalStateProvider>
          {children}
        </GlobalStateProvider>
      </SessionProvider>
    </PaperProvider>
  );
};
