import { useEffect, useState } from "react";
import type { City } from "../types/city";
import { fetchCityWeather } from "../api/weather";

interface UseCityWeatherResult {
  cities: City[];
  loading: boolean;
  error: string | null;
}

export const useCityWeather = (initialCities: City[]): UseCityWeatherResult => {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await Promise.all(
          initialCities.map(city => fetchCityWeather(city))
        );

        if (!cancelled) setCities(data);
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
  }, [initialCities]);

  return { cities, loading, error };
};