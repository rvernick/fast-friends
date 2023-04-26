import { createContext, useState } from "react";
import AppContext from "./app-context";

export const GlobalStateContext = createContext({ appContext: new AppContext() });

export const GlobalStateProvider = ({ children }) => {
  const [appContext, setAppContext] = useState(new AppContext()); 

  return (
    <GlobalStateContext.Provider value={{ appContext }}>
      {children}
    </GlobalStateContext.Provider>
  );
};