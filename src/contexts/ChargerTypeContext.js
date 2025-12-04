import { createContext, useContext, useState } from "react";

const ChargerTypeContext = createContext();

export const ChargerTypeProvider = ({ children }) => {
  const [chargerType, setChargerType] = useState("both");

  return (
    <ChargerTypeContext.Provider value={{ chargerType, setChargerType }}>
      {children}
    </ChargerTypeContext.Provider>
  );
};

export const useChargerType = () => useContext(ChargerTypeContext);
