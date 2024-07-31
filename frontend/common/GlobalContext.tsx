import { createContext, useState, ReactNode, useContext } from 'react';
import AppContext from "./app-context";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useSession } from '@/ctx';

const initialQueryClient = new QueryClient();
export const GlobalStateContext = createContext({ appContext: new AppContext(initialQueryClient, null) });

interface GlobalStateProviderProps {
  children: ReactNode;
}

export function useGlobalContext(): AppContext {
  const { appContext} = useContext(GlobalStateContext);
  return appContext;
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const session = useSession();
  const queryClient = useQueryClient()
  const [appContext, setAppContext] = useState(new AppContext(queryClient, session));

  return (
    <GlobalStateContext.Provider value={{ appContext }}>
      {children}
    </GlobalStateContext.Provider>
  );
}