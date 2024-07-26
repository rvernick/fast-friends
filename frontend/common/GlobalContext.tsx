import { createContext, useState, ReactNode } from 'react';
import AppContext from "./app-context";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
export const GlobalStateContext = createContext({ appContext: new AppContext(queryClient) });

interface GlobalStateProviderProps {
  children: ReactNode;
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [appContext, setAppContext] = useState(new AppContext(queryClient));

  return (
    <GlobalStateContext.Provider value={{ appContext }}>
      {children}
    </GlobalStateContext.Provider>
  );
}