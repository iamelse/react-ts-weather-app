import { useEffect, useState } from "react";
import type { WeatherState } from "../types/weather";
import type { City } from "../types/city";
import {
  fetchCurrentWeather,
  fetchHourlyWeather,
  fetchWeeklyWeather,
} from "../api/weather";
import { useSettings } from "../context/SettingsContext";

export const useWeather = (
  city: City | undefined,
  baseUrl: string
) => {
  const { unit } = useSettings();

  const [weather, setWeather] = useState<WeatherState>({
    hourly: [],
    weekly: [],
    temp: 0,
    feels_like: 0,
    wind_speed: 0,
    humidity: 0,
    uv_index: 0,
    sunrise: "N/A",
    sunset: "N/A",
    current_code: 0,
    is_day: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;

    let cancelled = false;

    const loadWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const [current, hourly, weekly] = await Promise.all([
          fetchCurrentWeather(
            city.latitude,
            city.longitude,
            baseUrl,
            unit
          ),
          fetchHourlyWeather(
            city.latitude,
            city.longitude,
            baseUrl,
            unit
          ),
          fetchWeeklyWeather(
            city.latitude,
            city.longitude,
            baseUrl,
            unit
          ),
        ]);

        if (!cancelled) {
          setWeather({
            hourly,
            weekly,

            // dari current weather
            temp: current.temp,
            feels_like: current.feels_like,
            humidity: current.humidity,
            current_code: current.current_code,

            // belum ada di API → default aman
            wind_speed: 0,
            uv_index: 0,
            sunrise: "N/A",
            sunset: "N/A",

            is_day: current.is_day,
          });
        }
      } catch {
        if (!cancelled) {
          setError("Failed to fetch weather");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [city, baseUrl, unit]);

  return { weather, loading, error };
};