import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import AppContext from "./app-context";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useSession } from '@/common/ctx';
import LogRocket from 'logrocket';
import { isProduction } from './utils';

const initialQueryClient = new QueryClient();
export const GlobalStateContext = createContext({ appContext: new AppContext(initialQueryClient, null) });

interface GlobalStateProviderProps {
  children: ReactNode;
}

export function useGlobalContext(): AppContext {
  const { appContext } = useContext(GlobalStateContext);
  return appContext;
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const session = useSession();
  const queryClient = useQueryClient()
  const [appContext, setAppContext] = useState(new AppContext(queryClient, session));
  const [logRocketInitialized, setLogRocketInitialized] = useState(false);

  const initializeLogRocket = () => {
    if (isProduction()) {
      LogRocket.init('e1y6b7/pedal-assistant');
    }
    setLogRocketInitialized(true);
  };

  useEffect(() => {
    if (!logRocketInitialized) {
      try {
        initializeLogRocket();
      } catch (error) {
        console.log('Error initializing LogRocket: ', error);
      }
    }
  }, [logRocketInitialized]);

  return (
    <GlobalStateContext.Provider value={{ appContext }}>
      {children}
    </GlobalStateContext.Provider>
  );
}