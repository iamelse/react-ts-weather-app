import type {
  CurrentWeather,
  HourlyItem,
  WeeklyItemType,
  AQIData,
} from "../types/weather";
import type { City } from "../types/city";
import { getWeatherInfo } from "../utils/weather";
import type { TempUnit } from "../types/settings";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const TIMEZONE = import.meta.env.VITE_TIMEZONE ?? "Asia/Bangkok";

const tempUnitParam = (unit: TempUnit) =>
  unit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";

const buildUrl = (
  lat: number,
  lon: number,
  params: string,
  unit: TempUnit,
  baseUrl: string = BASE_URL
) =>
  `${baseUrl}?latitude=${lat}&longitude=${lon}&${params}&timezone=${encodeURIComponent(TIMEZONE)}${tempUnitParam(unit)}`;

export const fetchCurrentCityWeather = async (
  city: City,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius"
): Promise<CurrentWeather> => {
  const url = buildUrl(city.latitude, city.longitude, "current=temperature_2m,weather_code,is_day", unit, baseUrl);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");

  const data = await res.json();
  if (!data.current) throw new Error("Invalid response: missing current data");

  return {
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weather_code,
    is_day: data.current.is_day,
  };
};

export const fetchCityWeather = async (
  city: City,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius"
): Promise<City> => {
  try {
    const url = buildUrl(city.latitude, city.longitude, "current=temperature_2m,weather_code,is_day", unit, baseUrl);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch weather for ${city.name}`);

    const data = await res.json();
    if (!data.current) throw new Error(`Invalid response for ${city.name}`);

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

export const fetchCurrentWeather = async (
  lat: number,
  lon: number,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius"
): Promise<{
  temp: number;
  feels_like: number;
  humidity: number;
  current_icon: string;
  current_text: string;
  current_code: number;
  is_day: 0 | 1;
  wind_direction: number;
}> => {
  const url = buildUrl(
    lat, lon,
    "current=weather_code,temperature_2m,relative_humidity_2m,precipitation,is_day,apparent_temperature,wind_direction_10m",
    unit, baseUrl
  );

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch current weather");

  const data = await res.json();
  if (!data.current) throw new Error("Invalid response: missing current data");

  const current = data.current;
  const iconData = getWeatherInfo(current.weather_code);

  return {
    temp: current.temperature_2m,
    feels_like: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    current_icon: iconData.icon,
    current_text: iconData.text,
    current_code: current.weather_code,
    is_day: current.is_day,
    wind_direction: current.wind_direction_10m ?? 0,
  };
};

export const fetchHourlyWeather = async (
  lat: number,
  lon: number,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius"
): Promise<HourlyItem[]> => {
  const url = buildUrl(
    lat, lon,
    "hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode,is_day,precipitation_probability",
    unit, baseUrl
  );

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch hourly weather");

  const data = await res.json();
  if (!data.hourly) throw new Error("Invalid response: missing hourly data");
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
        precip_prob: data.hourly.precipitation_probability[i],
        is_day: data.hourly.is_day[i],
        icon: iconData.icon,
        text: iconData.text,
        code: data.hourly.weathercode[i],
      });
    }
  }

  return hourly;
};

export interface DailyExtras {
  uv_index: number;
  sunrise: string;
  sunset: string;
}

export const fetchWeeklyWeather = async (
  lat: number,
  lon: number,
  baseUrl: string = BASE_URL,
  unit: TempUnit = "celsius",
  forecastDays: number = 7
): Promise<{ weekly: WeeklyItemType[]; extras: DailyExtras }> => {
  const url = buildUrl(
    lat, lon,
    `daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,uv_index_max,sunrise,sunset&forecast_days=${forecastDays}`,
    unit, baseUrl
  );

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weekly weather");

  const data = await res.json();
  if (!data.daily) throw new Error("Invalid response: missing daily data");

  const weekly: WeeklyItemType[] = data.daily.time.map((day: string, idx: number) => {
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

  const extras: DailyExtras = {
    uv_index: Math.round(data.daily.uv_index_max[0]),
    sunrise: data.daily.sunrise[0].split("T")[1].slice(0, 5),
    sunset: data.daily.sunset[0].split("T")[1].slice(0, 5),
  };

  return { weekly, extras };
};

/* ======================================================
   AIR QUALITY
====================================================== */
const AQI_BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

function aqiLevel(europeanAqi: number): string {
  if (europeanAqi <= 20) return "Good";
  if (europeanAqi <= 40) return "Fair";
  if (europeanAqi <= 60) return "Moderate";
  if (europeanAqi <= 80) return "Poor";
  if (europeanAqi <= 100) return "Very Poor";
  return "Extremely Poor";
}

export const fetchAirQuality = async (
  lat: number,
  lon: number
): Promise<AQIData> => {
  const url = `${AQI_BASE_URL}?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch air quality");

  const data = await res.json();
  if (!data.current) throw new Error("Invalid response: missing AQI data");

  const aqi = Math.round(data.current.european_aqi);

  return {
    aqi,
    level: aqiLevel(aqi),
    pm2_5: data.current.pm2_5,
    pm10: data.current.pm10,
  };
};
