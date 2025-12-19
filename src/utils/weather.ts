import type { BackgroundGradient, WeatherInfo, DayPhase } from "../types/weather";
import { hexToHsl, hslToCss } from "./color";

// =======================
// BASE WEATHER COLORS
// =======================
// Warna dasar untuk masing-masing kondisi cuaca.
// Digunakan sebagai dasar sebelum dihitung fase siang/malam.
export const baseWeatherColor: Record<number, string> = {
  0: "#0d1b2a", // clear sky → gelap navy
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
  99: "#2d3a45",
};

// =======================
// NORMALIZE WMO CODE
// =======================
// Map kode WMO dari API ke kategori standar kita
const normalizeWeatherCode = (code?: number): number => {
  if (code == null) return -1;

  if ([0, 1, 2, 3].includes(code)) return code; // Clear & clouds
  if ([45, 48].includes(code)) return 45;        // Fog
  if (code >= 51 && code <= 57) return 51;       // Drizzle
  if (code >= 61 && code <= 67) return 61;       // Rain
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 71; // Snow
  if (code >= 80 && code <= 82) return 80;       // Rain showers
  if (code === 95) return 95;                     // Thunderstorm
  if (code === 96 || code === 99) return 96;     // Thunderstorm with hail

  return -1;
};

// =======================
// WEATHER ICON + TEXT MAP
// =======================
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
  99: { icon: "hail", text: "Thunderstorm with hail" },
};

// =======================
// WEATHER INFO HELPER
// =======================
// Menghasilkan icon dan text berdasarkan kode cuaca dan siang/malam
export const getWeatherInfo = (code?: number, isDay: 0 | 1 = 1): WeatherInfo => {
  const normalized = normalizeWeatherCode(code);
  const info = weatherMap[normalized];

  if (!info) return { icon: isDay ? "day.svg" : "night.svg", text: "Unknown" };

  let baseIcon = info.icon.replace(/\.svg$/, "");
  const exceptions = [
    "cloudy", "fog", "drizzle", "hail", "rain",
    "sleet", "thunderstorm", "tornado", "wind"
  ];

  // Jika icon termasuk exceptions, pakai icon apa adanya
  if (exceptions.includes(baseIcon)) return { ...info, icon: `${baseIcon}.svg` };

  // Ubah suffix -day menjadi -night jika malam
  if (isDay === 0 && baseIcon.includes("-day")) {
    baseIcon = baseIcon.replace("-day", "-night");
  }

  return { ...info, icon: `${baseIcon}.svg` };
};

// =======================
// SCORING SYSTEM
// =======================
const phaseScore: Record<DayPhase, number> = {
  night: -60,
  dusk: -30,
  dawn: -15,
  day: 20
};

const weatherScore: Record<number, number> = {
  0: 25, 1: 10, 2: 5, 3: -15,
  45: -25, 51: -20, 61: -35,
  71: -10, 80: -40, 95: -50, 96: -55
};

// =======================
// MOONLIGHT TINT OTOMATIS
// =======================
// Clear sky malam lebih gelap, hujan/awan lebih terang
const applyMoonlightTint = (
  h: number,
  s: number,
  l: number,
  phase: DayPhase,
  weatherCode?: number
) => {
  if (phase !== "night") return { h, s, l };

  const darkScale: Record<number, number> = {
    0: 40, 1: 30, 2: 25, 3: 20,
    45: 15, 51: 15, 61: 15,
    71: 10, 80: 10, 95: 10, 96: 10, 99: 10
  };

  const darken = darkScale[weatherCode ?? -1] ?? 15;

  return {
    h,
    s: Math.max(s - 15, 10),
    l: Math.max(l - darken, 5)
  };
};

// =======================
// BACKGROUND GENERATOR
// =======================
export const getBackgroundByWeather = (
  weatherCode?: number,
  phase: DayPhase = "day"
): BackgroundGradient => {
  const normalized = normalizeWeatherCode(weatherCode);
  const baseHex = baseWeatherColor[normalized] ?? "#77b9e4";
  const base = hexToHsl(baseHex);

  // Hitung lightness berdasarkan phase dan cuaca
  let lightness = base.l + (phaseScore[phase] ?? 0) + (weatherScore[normalized] ?? 0);

  // Tambahan untuk siang hari
  if (phase === "day") lightness += 5;
  if (phase === "day" && [1, 2, 3].includes(normalized)) lightness = Math.min(lightness, 70);

  lightness = Math.max(12, Math.min(88, lightness));

  // Terapkan moonlight tint untuk malam hari
  const tinted = applyMoonlightTint(base.h, base.s, lightness, phase, normalized);

  return {
    from: hslToCss(tinted.h, tinted.s, tinted.l),
    to: hslToCss(tinted.h, tinted.s, Math.max(tinted.l - 12, 5))
  };
};

// =======================
// USAGE
// =======================
// Pastikan phase = "day" atau "night" dari API is_day
// const phase: DayPhase = weather.is_day ? "day" : "night";
// const bg = getBackgroundByWeather(weather.current_code, phase);