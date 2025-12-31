import { createContext, useContext, useEffect, useState } from "react";

export type TempUnit = "celsius" | "fahrenheit";

interface SettingsContextValue {
  unit: TempUnit;
  setUnit: (unit: TempUnit) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnitState] = useState<TempUnit>("celsius");

  useEffect(() => {
    const saved = localStorage.getItem("temp_unit") as TempUnit | null;
    if (saved) setUnitState(saved);
  }, []);

  const setUnit = (value: TempUnit) => {
    setUnitState(value);
    localStorage.setItem("temp_unit", value);
  };

  return (
    <SettingsContext.Provider value={{ unit, setUnit }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return ctx;
}