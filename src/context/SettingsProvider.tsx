import { useState, useCallback } from "react";
import type { TempUnit } from "../types/settings";
import { SettingsContext } from "./settingsContext";

function getInitialUnit(): TempUnit {
  const saved = localStorage.getItem("temp_unit");
  return saved === "celsius" || saved === "fahrenheit" ? saved : "celsius";
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnitState] = useState<TempUnit>(getInitialUnit);

  const setUnit = useCallback((value: TempUnit) => {
    setUnitState(value);
    localStorage.setItem("temp_unit", value);
  }, []);

  return (
    <SettingsContext.Provider value={{ unit, setUnit }}>
      {children}
    </SettingsContext.Provider>
  );
}
