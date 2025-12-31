import { useEffect, useState } from "react";
import type { City } from "../types/city";
import { fetchCityWeather } from "../api/weather";
import { useSettings } from "../context/SettingsContext";

interface UseCityWeatherResult {
  cities: City[];
  loading: boolean;
  error: string | null;
}

export const useCityWeather = (
  initialCities: City[]
): UseCityWeatherResult => {
  const { unit } = useSettings(); // 🔥 ambil unit dari settings

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialCities.length) {
      setCities([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await Promise.all(
          initialCities.map((city) =>
            fetchCityWeather(
              city,
              undefined, // pakai BASE_URL default
              unit       // 🔥 INI KUNCI
            )
          )
        );

        if (!cancelled) {
          setCities(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to fetch weather");
        }
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [initialCities, unit]); // 🔥 unit jadi dependency

  return { cities, loading, error };
};