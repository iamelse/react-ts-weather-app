import type { City, HourlyItem, WeeklyItemType } from "../types/weather";
import { getWeatherIcon } from "../utils/weather";

export const fetchCityWeather = async (city: City) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code`
    );
    const data = await res.json();
    const current = data.current;

    return {
      ...city,
      current_temp: current.temperature_2m,
      current_code: current.weather_code,
    };
  } catch (err) {
    console.error(`Failed to fetch weather for ${city.name}`, err);
    return city;
  }
};

export const fetchCurrentWeather = async (lat: number, lon: number, baseUrl: string) => {
  const res = await fetch(
    `${baseUrl}?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m,relative_humidity_2m,precipitation,is_day,apparent_temperature`
  );
  const data = await res.json();
  const current = data.current;
  const iconData = getWeatherIcon(current.weather_code);

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

export const fetchHourlyWeather = async (lat: number, lon: number, baseUrl: string): Promise<HourlyItem[]> => {
  const res = await fetch(
    `${baseUrl}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode`
  );
  const data = await res.json();
  const now = new Date();
  const hourly: HourlyItem[] = [];

  for (let i = 0; i < data.hourly.time.length; i++) {
    const timeStr = data.hourly.time[i];
    const timeDate = new Date(timeStr);

    if (timeDate >= now && timeDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
      const iconData = getWeatherIcon(data.hourly.weathercode[i]);
      hourly.push({
        time: timeStr.split("T")[1].slice(0, 5),
        temp: data.hourly.temperature_2m[i],
        feels_like: data.hourly.apparent_temperature[i],
        humidity: data.hourly.relative_humidity_2m[i],
        wind_speed: data.hourly.wind_speed_10m[i],
        icon: iconData.icon,
        text: iconData.text,
      });
    }
  }

  return hourly;
};

export const fetchWeeklyWeather = async (lat: number, lon: number, baseUrl: string): Promise<WeeklyItemType[]> => {
  const res = await fetch(
    `${baseUrl}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&forecast_days=7&timezone=auto`
  );
  const data = await res.json();

  return data.daily.time.map((day: string, idx: number) => {
    const iconData = getWeatherIcon(data.daily.weathercode[idx]);
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