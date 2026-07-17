import { createContext } from "react";
import type { TempUnit } from "../types/settings";

export interface SettingsContextValue {
  unit: TempUnit;
  setUnit: (unit: TempUnit) => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);
