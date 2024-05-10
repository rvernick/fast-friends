import { createContext, useState } from 'react';
import AppContext from "./app-context";
import { QueryClient } from '@tanstack/react-query';

export const GlobalStateContext = createContext({ appContext: new AppContext() });

export const GlobalStateProvider = ({ children }) => {
  const [appContext, setAppContext] = useState(new AppContext());

  appContext.setQueryClient(new QueryClient());
  return (
    <GlobalStateContext.Provider value={{ appContext }}>
      {children}
    </GlobalStateContext.Provider>
  );
};