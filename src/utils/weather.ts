import type { BackgroundGradient, WeatherInfo } from "../types/weather";
import { Sun, Cloud, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from "lucide-react";

// Mapping kode WMO ke icon & text
const weatherMap: { [key: number]: WeatherInfo } = {
  0: { icon: Sun, text: "Clear sky" },
  1: { icon: Cloud, text: "Partly cloudy" },
  2: { icon: Cloud, text: "Partly cloudy" },
  3: { icon: Cloud, text: "Overcast" },
  45: { icon: CloudDrizzle, text: "Fog" },
  48: { icon: CloudDrizzle, text: "Fog" },
  51: { icon: CloudDrizzle, text: "Drizzle" },
  53: { icon: CloudDrizzle, text: "Drizzle" },
  55: { icon: CloudDrizzle, text: "Drizzle" },
  56: { icon: CloudDrizzle, text: "Freezing Drizzle" },
  57: { icon: CloudDrizzle, text: "Freezing Drizzle" },
  61: { icon: CloudRain, text: "Rain" },
  63: { icon: CloudRain, text: "Rain" },
  65: { icon: CloudRain, text: "Rain" },
  66: { icon: CloudRain, text: "Freezing Rain" },
  67: { icon: CloudRain, text: "Freezing Rain" },
  71: { icon: CloudSnow, text: "Snow" },
  73: { icon: CloudSnow, text: "Snow" },
  75: { icon: CloudSnow, text: "Snow" },
  77: { icon: CloudSnow, text: "Snow grains" },
  80: { icon: CloudRain, text: "Rain showers" },
  81: { icon: CloudRain, text: "Rain showers" },
  82: { icon: CloudRain, text: "Rain showers" },
  85: { icon: CloudSnow, text: "Snow showers" },
  86: { icon: CloudSnow, text: "Snow showers" },
  95: { icon: CloudLightning, text: "Thunderstorm" },
  96: { icon: CloudLightning, text: "Thunderstorm with hail" },
  99: { icon: CloudLightning, text: "Thunderstorm with hail" },
};

export const getBackgroundByWeather = (
  weatherCode?: number,
  isDay: boolean = true
): BackgroundGradient => {
  switch (weatherCode) {
    case 0: // Clear sky
      return isDay
        ? { from: "#77b9e4", to: "#5aa0d1" }
        : { from: "#0f2027", to: "#203a43" };
    case 1:
    case 2: // Mainly clear, partly cloudy
      return isDay
        ? { from: "#a0c4ff", to: "#457b9d" }
        : { from: "#2c3e50", to: "#4b6584" };
    case 3: // Overcast
      return isDay
        ? { from: "#cfd9df", to: "#e2ebf0" }
        : { from: "#3a3a3a", to: "#1c1c1c" };
    case 45: // Fog
    case 48: // Depositing rime fog
      return isDay
        ? { from: "#d3d3d3", to: "#a9a9a9" }
        : { from: "#2c2c2c", to: "#1a1a1a" };
    case 51: // Light drizzle
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return isDay
        ? { from: "#4e7ac7", to: "#2a4d8b" }
        : { from: "#1b2735", to: "#090a0f" };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return isDay
        ? { from: "#e0f7fa", to: "#81d4fa" }
        : { from: "#2a3a40", to: "#0d1b20" };
    case 95:
    case 96:
    case 99:
      return isDay
        ? { from: "#ffb347", to: "#ffcc33" }
        : { from: "#3a1c1c", to: "#1c0d0d" };
    default:
      return isDay
        ? { from: "#77b9e4", to: "#5aa0d1" }
        : { from: "#0f2027", to: "#203a43" };
  }
};

export const getWeatherIcon = (code: number): WeatherInfo => {
  return weatherMap[code] ?? { icon: Sun, text: "Unknown" };
};