import type {
  BackgroundGradient,
  WeatherInfo,
  DayPhase,
} from "../types/weather";
import { hexToHsl, hslToCss } from "./color";
import { baseWeatherColor } from "./weatherColors";

/* =======================
   NORMALIZE WMO CODE
======================= */
const normalizeWeatherCode = (code?: number): number => {
  if (code == null) return -1;

  // Clear & clouds
  if ([0, 1, 2, 3].includes(code)) return code;

  // Fog
  if ([45, 48].includes(code)) return 45;

  // Drizzle (51–57)
  if (code >= 51 && code <= 57) return 51;

  // Rain (61–67)
  if (code >= 61 && code <= 67) return 61;

  // Snow (71–77, 85–86)
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86))
    return 71;

  // Rain showers
  if (code >= 80 && code <= 82) return 80;

  // Thunderstorm
  if (code === 95) return 95;
  if (code === 96 || code === 99) return 96;

  return -1;
};

/* =======================
   ICON + TEXT MAP
======================= */
/**
 * icon = nama file di /public/icons/animated (tanpa .svg)
 */
export const weatherMap: Record<number, WeatherInfo> = {
  0: { icon: "clear-day", text: "Clear sky" },

  1: { icon: "partly-cloudy-day", text: "Mainly clear" },
  2: { icon: "partly-cloudy-day", text: "Partly cloudy" },
  3: { icon: "cloudy", text: "Overcast" },

  45: { icon: "fog", text: "Fog" },

  51: { icon: "rainy", text: "Drizzle" },

  61: { icon: "rain", text: "Rain" },

  71: { icon: "snow", text: "Snow" },

  80: { icon: "rainy-5", text: "Rain showers" },

  95: { icon: "thunder", text: "Thunderstorm" },
  96: {
    icon: "severe-thunderstorm",
    text: "Thunderstorm with hail",
  },
};

/* =======================
   WEATHER INFO HELPER
======================= */
export const getWeatherInfo = (
  code?: number,
  isDay: 0 | 1 = 1
): WeatherInfo => {
  const normalized = normalizeWeatherCode(code);
  const info = weatherMap[normalized];

  if (!info) {
    return {
      icon: isDay ? "day.svg" : "night.svg",
      text: "Unknown",
    };
  }

  // Ambil nama dasar: hapus ekstensi dan -day/-night
  const baseName = info.icon
    .replace(/(\.svg|(-day|-night))$/, "")
    .replace(/-\d+$/, "");

  // Daftar pengecualian: tidak pakai -day/-night
  const exceptions = [
                      "fog", "mist", "smoke",
                      "severe-thunderstorm", "thunder", "tornado",
                      "sleet", "scattered-thunderstorms", "haze",
                      "hurricane", "snowy"
                    ];

  const icon = exceptions.includes(baseName)
    ? `${baseName}.svg`
    : isDay
    ? `${baseName}-day.svg`
    : `${baseName}-night.svg`;

  return {
    ...info,
    icon,
  };
};

/* =======================
   SCORING SYSTEM
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
  80: -40,
  95: -50,
  96: -55,
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
    h: Math.min(h + 10, 240),
    s: Math.max(s - 15, 10),
    l: l - 5,
  };
};

/* =======================
   BACKGROUND GENERATOR
======================= */
export const getBackgroundByWeather = (
  weatherCode?: number,
  phase: DayPhase = "day"
): BackgroundGradient => {
  const normalized = normalizeWeatherCode(weatherCode);

  const baseHex =
    baseWeatherColor[normalized] ?? "#77b9e4";
  const base = hexToHsl(baseHex);

  const totalScore =
    phaseScore[phase] +
    (weatherScore[normalized] ?? 0);

  let lightness = base.l + totalScore;

  if (phase === "day") {
    lightness += 5;
  }

  if (phase === "day" && [1, 2, 3].includes(normalized)) {
    lightness = Math.min(lightness, 70);
  }

  lightness = Math.max(12, Math.min(88, lightness));

  const tinted = applyMoonlightTint(
    base.h,
    base.s,
    lightness,
    phase
  );

  return {
    from: hslToCss(tinted.h, tinted.s, tinted.l),
    to: hslToCss(
      tinted.h,
      tinted.s,
      Math.max(tinted.l - 12, 12)
    ),
  };
};