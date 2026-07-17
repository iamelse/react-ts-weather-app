import { useEffect, useState, useCallback } from "react";
import type { WeatherState } from "../types/weather";
import type { City } from "../types/city";
import {
  fetchCurrentWeather,
  fetchHourlyWeather,
  fetchWeeklyWeather,
  fetchAirQuality,
} from "../api/weather";
import { useSettings } from "./useSettings";

export const useWeather = (
  city: City | undefined,
  baseUrl: string,
  forecastDays: number = 7
) => {
  const { unit } = useSettings();

  const [weather, setWeather] = useState<WeatherState>({
    hourly: [],
    weekly: [],
    temp: 0,
    feels_like: 0,
    wind_speed: 0,
    wind_direction: 0,
    humidity: 0,
    uv_index: 0,
    sunrise: "N/A",
    sunset: "N/A",
    current_code: 0,
    is_day: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
            unit,
            forecastDays
          ),
        ]);

        if (cancelled) return;

        const newWeather: WeatherState = {
          hourly,
          weekly: weekly.weekly,

          temp: current.temp,
          feels_like: current.feels_like,
          humidity: current.humidity,
          current_code: current.current_code,

          wind_speed: hourly[0]?.wind_speed ?? 0,
          wind_direction: current.wind_direction,
          uv_index: weekly.extras.uv_index,
          sunrise: weekly.extras.sunrise,
          sunset: weekly.extras.sunset,

          is_day: current.is_day,
        };

        try {
          const aqi = await fetchAirQuality(city.latitude, city.longitude);
          if (!cancelled) newWeather.aqi = aqi;
        } catch {
          // AQI is optional
        }

        if (!cancelled) setWeather(newWeather);
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
  }, [city, baseUrl, unit, refreshKey, forecastDays]);

  const refresh = useCallback(async () => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { weather, loading, error, refresh };
};
