import { useState, useEffect } from "react";
import type { WeatherState } from "../types/weather";
import type { City } from "../types/city";
import { fetchCurrentWeather, fetchHourlyWeather, fetchWeeklyWeather } from "../api/weather";

export const useWeather = (city: City, baseUrl: string) => {
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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const [current, hourly, weekly] = await Promise.all([
          fetchCurrentWeather(city.latitude, city.longitude, baseUrl),
          fetchHourlyWeather(city.latitude, city.longitude, baseUrl),
          fetchWeeklyWeather(city.latitude, city.longitude, baseUrl),
        ]);

        if (!cancelled) {
          setWeather(prev => ({
            ...prev,
            ...current,
            hourly,
            weekly,
          }));
        }
      } catch (err) {
        if (!cancelled) setError("Failed to fetch weather");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [city, baseUrl]);

  return { weather, loading, error };
};