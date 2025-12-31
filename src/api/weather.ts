import type {
  CurrentWeather,
  HourlyItem,
  WeeklyItemType,
} from "../types/weather";
import type { City } from "../types/city";
import { getWeatherInfo } from "../utils/weather";
import type { TempUnit } from "../context/SettingsContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/* ======================================================
   Helper
====================================================== */
const tempUnitParam = (unit: TempUnit) =>
  unit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";

/* ======================================================
   CURRENT CITY (Sidebar, Favorite)
====================================================== */
export const fetchCurrentCityWeather = async (
  city: City,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius"
): Promise<CurrentWeather> => {
  const url =
    `${baseUrl}?latitude=${city.latitude}` +
    `&longitude=${city.longitude}` +
    `&current=temperature_2m,weather_code,is_day` +
    `&timezone=Asia%2FBangkok` +
    tempUnitParam(unit);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");

  const data = await res.json();

  return {
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weather_code,
    is_day: data.current.is_day,
  };
};

/* ======================================================
   CITY WEATHER (City List)
====================================================== */
export const fetchCityWeather = async (
  city: City,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius"
): Promise<City> => {
  try {
    const url =
      `${baseUrl}?latitude=${city.latitude}` +
      `&longitude=${city.longitude}` +
      `&current=temperature_2m,weather_code,is_day` +
      `&timezone=Asia%2FBangkok` +
      tempUnitParam(unit);

    const res = await fetch(url);
    const data = await res.json();

    return {
      ...city,
      current_temp: data.current.temperature_2m,
      current_code: data.current.weather_code,
      is_day: data.current.is_day,
    };
  } catch (err) {
    console.error(`Failed to fetch weather for ${city.name}`, err);
    return city;
  }
};

/* ======================================================
   CURRENT WEATHER (Main Header)
====================================================== */
export const fetchCurrentWeather = async (
  lat: number,
  lon: number,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius"
) => {
  const url =
    `${baseUrl}?latitude=${lat}` +
    `&longitude=${lon}` +
    `&current=weather_code,temperature_2m,relative_humidity_2m,precipitation,is_day,apparent_temperature` +
    `&timezone=Asia%2FBangkok` +
    tempUnitParam(unit);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch current weather");

  const data = await res.json();
  const current = data.current;
  const iconData = getWeatherInfo(current.weather_code);

  return {
    temp: current.temperature_2m,
    feels_like: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    current_icon: iconData.icon,
    current_text: iconData.text,
    current_code: current.weather_code,
    is_day: current.is_day === 1,
  };
};

/* ======================================================
   HOURLY WEATHER
====================================================== */
export const fetchHourlyWeather = async (
  lat: number,
  lon: number,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius"
): Promise<HourlyItem[]> => {
  const url =
    `${baseUrl}?latitude=${lat}` +
    `&longitude=${lon}` +
    `&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode,is_day` +
    `&timezone=Asia%2FBangkok` +
    tempUnitParam(unit);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch hourly weather");

  const data = await res.json();
  const now = new Date();
  const hourly: HourlyItem[] = [];

  for (let i = 0; i < data.hourly.time.length; i++) {
    const timeDate = new Date(data.hourly.time[i]);

    if (timeDate >= now && timeDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
      const iconData = getWeatherInfo(
        data.hourly.weathercode[i],
        data.hourly.is_day[i] === 1 ? 1 : 0
      );

      hourly.push({
        time: data.hourly.time[i].split("T")[1].slice(0, 5),
        temp: data.hourly.temperature_2m[i],
        feels_like: data.hourly.apparent_temperature[i],
        humidity: data.hourly.relative_humidity_2m[i],
        wind_speed: data.hourly.wind_speed_10m[i],
        is_day: data.hourly.is_day[i],
        icon: iconData.icon,
        text: iconData.text,
        code: data.hourly.weathercode[i],
      });
    }
  }

  return hourly;
};

/* ======================================================
   WEEKLY WEATHER
====================================================== */
export const fetchWeeklyWeather = async (
  lat: number,
  lon: number,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius"
): Promise<WeeklyItemType[]> => {
  const url =
    `${baseUrl}?latitude=${lat}` +
    `&longitude=${lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode` +
    `&forecast_days=7` +
    `&timezone=Asia%2FBangkok` +
    tempUnitParam(unit);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weekly weather");

  const data = await res.json();

  return data.daily.time.map((day: string, idx: number) => {
    const iconData = getWeatherInfo(data.daily.weathercode[idx], 1);

    return {
      date: day,
      temp_max: data.daily.temperature_2m_max[idx],
      temp_min: data.daily.temperature_2m_min[idx],
      precipitation: data.daily.precipitation_sum[idx],
      icon: iconData.icon,
      text: iconData.text,
      code: data.daily.weathercode[idx],
    };
  });
};