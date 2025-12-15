import { useEffect, useState } from "react";
import type { DayPhase } from "../types/weather";

// 🔥 DEV ONLY (UBAH UNTUK TEST)
const DEV_FORCE_HOUR: number | null = null;
// 6 = dawn | 12 = day | 18 = dusk | 22 = night

const getPhaseFromHour = (hour: number): DayPhase => {
  if (hour < 5) return "night";
  if (hour < 8) return "dawn";
  if (hour < 17) return "day";
  if (hour < 19) return "dusk";
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