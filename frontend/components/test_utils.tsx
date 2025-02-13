import { GlobalStateProvider } from "../common/GlobalContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, ThemeProvider } from "react-native-paper";
import { SessionProvider } from "@/common/ctx";

import { Colors } from "../constants/Colors";
import { useColorScheme } from 'react-native';
import { ReactNode } from "react";
import ErrorBoundary from 'react-native-error-boundary';
import { GluestackUIProvider } from "./ui/gluestack-ui-provider";

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

  const onError = (error: Error, stackTrace: string) => {
    console.error(error, stackTrace);
  };

  return (
    <ErrorBoundary onError={onError}>
      <PaperProvider theme={colorScheme}>
        <GluestackUIProvider>
          <QueryClientProvider client={queryClient}>
            <SessionProvider>
              <GlobalStateProvider>
                {children}
              </GlobalStateProvider>
            </SessionProvider>
          </QueryClientProvider>
        </GluestackUIProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
};
