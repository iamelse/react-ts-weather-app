import type { BackgroundGradient, WeatherInfo, DayPhase } from "../types/weather";
import { hexToHsl, hslToCss } from "./color";

const LIGHTNESS_CLAMP_MIN = 12;
const LIGHTNESS_CLAMP_MAX = 88;
const DAY_BOOST = 5;
const CLOUDY_DAY_CAP = 70;
const SATURATION_REDUCTION = 15;
const SATURATION_MIN = 10;
const GRADIENT_DARKEN = 12;
const ABSOLUTE_MIN_LIGHTNESS = 5;
const DEFAULT_DARKEN = 15;

const NIGHT_PHASE_SCORE = -60;
const DUSK_PHASE_SCORE = -30;
const DAWN_PHASE_SCORE = -15;
const DAY_PHASE_SCORE = 20;

export const baseWeatherColor: Record<number, string> = {
  0: "#0d1b2a",
  1: "#1a2a3a",
  2: "#1e3345",
  3: "#2a3b50",
  45: "#4f5b62",
  51: "#3e4a5a",
  61: "#2d3a45",
  71: "#dff3f5",
  80: "#3a4a5c",
  95: "#2d3a45",
  96: "#2d3a45",
};

const normalizeWeatherCode = (code?: number): number => {
  if (code == null) return -1;

  if ([0, 1, 2, 3].includes(code)) return code;
  if ([45, 48].includes(code)) return 45;
  if (code >= 51 && code <= 57) return 51;
  if (code >= 61 && code <= 67) return 61;
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 71;
  if (code >= 80 && code <= 82) return 80;
  if (code === 95) return 95;
  if (code === 96 || code === 99) return 96;

  return -1;
};

export const weatherMap: Record<number, WeatherInfo> = {
  0: { icon: "clear-day", text: "Clear sky" },
  1: { icon: "partly-cloudy-day", text: "Mainly clear" },
  2: { icon: "partly-cloudy-day", text: "Partly cloudy" },
  3: { icon: "cloudy", text: "Overcast" },
  45: { icon: "fog", text: "Fog" },
  51: { icon: "drizzle", text: "Drizzle" },
  61: { icon: "rain", text: "Rain" },
  71: { icon: "snow", text: "Snow" },
  80: { icon: "partly-cloudy-day-rain", text: "Rain showers" },
  95: { icon: "thunderstorm", text: "Thunderstorm" },
  96: { icon: "hail", text: "Thunderstorm with hail" },
};

const exceptions = [
  "cloudy", "fog", "drizzle", "hail", "rain",
  "sleet", "thunderstorm", "tornado", "wind"
];

export const getWeatherInfo = (code?: number, isDay: 0 | 1 = 1): WeatherInfo => {
  const normalized = normalizeWeatherCode(code);
  const info = weatherMap[normalized];

  if (!info) return { icon: isDay ? "clear-day.svg" : "clear-night.svg", text: "Unknown" };

  let baseIcon = info.icon.replace(/\.svg$/, "");
  if (exceptions.includes(baseIcon)) return { ...info, icon: `${baseIcon}.svg` };

  if (isDay === 0 && baseIcon.includes("-day")) {
    baseIcon = baseIcon.replace("-day", "-night");
  }

  return { ...info, icon: `${baseIcon}.svg` };
};

const phaseScore: Record<DayPhase, number> = {
  night: NIGHT_PHASE_SCORE,
  dusk: DUSK_PHASE_SCORE,
  dawn: DAWN_PHASE_SCORE,
  day: DAY_PHASE_SCORE,
};

const weatherScore: Record<number, number> = {
  0: 25, 1: 10, 2: 5, 3: -15,
  45: -25, 51: -20, 61: -35,
  71: -10, 80: -40, 95: -50, 96: -55,
};

const darkScale: Record<number, number> = {
  0: 40, 1: 30, 2: 25, 3: 20,
  45: 15, 51: 15, 61: 15,
  71: 10, 80: 10, 95: 10, 96: 10,
};

const applyMoonlightTint = (
  h: number, s: number, l: number,
  phase: DayPhase, weatherCode?: number
) => {
  if (phase !== "night") return { h, s, l };

  const darken = darkScale[weatherCode ?? -1] ?? DEFAULT_DARKEN;

  return {
    h,
    s: Math.max(s - SATURATION_REDUCTION, SATURATION_MIN),
    l: Math.max(l - darken, ABSOLUTE_MIN_LIGHTNESS),
  };
};

const DEFAULT_BG_COLOR = "#77b9e4";
const CLOUDY_CODES = [1, 2, 3];

export const getBackgroundByWeather = (
  weatherCode?: number,
  phase: DayPhase = "day"
): BackgroundGradient => {
  const normalized = normalizeWeatherCode(weatherCode);
  const baseHex = baseWeatherColor[normalized] ?? DEFAULT_BG_COLOR;
  const base = hexToHsl(baseHex);

  let lightness = base.l + (phaseScore[phase] ?? 0) + (weatherScore[normalized] ?? 0);

  if (phase === "day") lightness += DAY_BOOST;
  if (phase === "day" && CLOUDY_CODES.includes(normalized)) lightness = Math.min(lightness, CLOUDY_DAY_CAP);

  lightness = Math.max(LIGHTNESS_CLAMP_MIN, Math.min(LIGHTNESS_CLAMP_MAX, lightness));

  const tinted = applyMoonlightTint(base.h, base.s, lightness, phase, normalized);

  return {
    from: hslToCss(tinted.h, tinted.s, tinted.l),
    to: hslToCss(tinted.h, tinted.s, Math.max(tinted.l - GRADIENT_DARKEN, ABSOLUTE_MIN_LIGHTNESS)),
  };
};