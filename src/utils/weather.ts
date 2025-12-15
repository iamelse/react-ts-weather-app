import type { BackgroundGradient, WeatherInfo, DayPhase } from "../types/weather";
import {
  Sun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from "lucide-react";
import { hexToHsl, hslToCss } from "./color";
import { baseWeatherColor } from "./weatherColors";

/* =======================
   ICON + TEXT
======================= */

export const weatherMap: Record<number, WeatherInfo> = {
  0: { icon: Sun, text: "Clear sky" },
  1: { icon: Cloud, text: "Partly cloudy" },
  2: { icon: Cloud, text: "Partly cloudy" },
  3: { icon: Cloud, text: "Overcast" },
  45: { icon: CloudDrizzle, text: "Fog" },
  48: { icon: CloudDrizzle, text: "Fog" },
  51: { icon: CloudDrizzle, text: "Drizzle" },
  61: { icon: CloudRain, text: "Rain" },
  71: { icon: CloudSnow, text: "Snow" },
  95: { icon: CloudLightning, text: "Thunderstorm" },
  96: { icon: CloudLightning, text: "Thunderstorm with hail" },
  99: { icon: CloudLightning, text: "Thunderstorm with hail" },
};

export const getWeatherInfo = (code?: number): WeatherInfo => {
  return weatherMap[code ?? -1] ?? {
    icon: Sun,
    text: "Unknown",
  };
};

/* =======================
   SCORING
======================= */

const phaseScore: Record<DayPhase, number> = {
  night: -60,
  dusk: -30,
  dawn: -15,
  day: 20,
};

const weatherScore: Record<number, number> = {
  0: 25,
  1: 10,
  2: 5,
  3: -15,
  45: -25,
  51: -20,
  61: -35,
  71: -10,
  95: -50,
  96: -55,
  99: -55,
};

/* =======================
   MOONLIGHT TINT
======================= */

const applyMoonlightTint = (
  h: number,
  s: number,
  l: number,
  phase: DayPhase
) => {
  if (phase !== "night") return { h, s, l };

  return {
    h: Math.min(h + 10, 240), // geser ke biru
    s: Math.max(s - 15, 10), // lebih kalem
    l: l - 5,                // lebih gelap
  };
};

/* =======================
   BACKGROUND GENERATOR
======================= */

export const getBackgroundByWeather = (
  weatherCode?: number,
  phase: DayPhase = "day"
): BackgroundGradient => {
  const baseHex =
    baseWeatherColor[weatherCode ?? 0] ?? "#77b9e4";

  const base = hexToHsl(baseHex);

  const phaseValue = phaseScore[phase];
  const weatherValue = weatherScore[weatherCode ?? -1] ?? 0;

  const totalScore = phaseValue + weatherValue;

  let lightness = base.l + totalScore;
  lightness = Math.max(12, Math.min(88, lightness));

  const tinted = applyMoonlightTint(
    base.h,
    base.s,
    lightness,
    phase
  );

  /* 🔍 DEBUG */
  console.table({
    phase,
    weatherCode,
    phaseValue,
    weatherValue,
    totalScore,
    baseLightness: base.l,
    finalLightness: tinted.l,
  });

  return {
    from: hslToCss(tinted.h, tinted.s, tinted.l),
    to: hslToCss(tinted.h, tinted.s, tinted.l - 12),
  };
};