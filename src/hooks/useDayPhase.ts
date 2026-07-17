import { useEffect, useState } from "react";
import type { DayPhase } from "../types/weather";

const DEV_FORCE_HOUR: number | null = null;

const NIGHT_END = 5;
const DAWN_END = 8;
const DAY_END = 17;
const DUSK_END = 19;

const getPhaseFromHour = (hour: number): DayPhase => {
  if (hour < NIGHT_END) return "night";
  if (hour < DAWN_END) return "dawn";
  if (hour < DAY_END) return "day";
  if (hour < DUSK_END) return "dusk";
  return "night";
};

export const useDayPhase = (): DayPhase => {
  const getHour = () =>
    DEV_FORCE_HOUR ?? new Date().getHours();

  const [phase, setPhase] = useState<DayPhase>(() =>
    getPhaseFromHour(getHour())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(getPhaseFromHour(getHour()));
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return phase;
};