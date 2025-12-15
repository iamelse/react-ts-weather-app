import type { City, CurrentWeather } from "../types/weather";
import { fetchCurrentCityWeather } from "../api/weather";
import { useEffect, useState } from "react";

export const useFavoriteWeather = (city: City | null) => {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCurrentCityWeather(city);
        if (!cancelled) setWeather(data);
      } catch (err) {
        if (!cancelled) setError("Failed to fetch weather");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [city]);

  return { weather, loading, error };
};