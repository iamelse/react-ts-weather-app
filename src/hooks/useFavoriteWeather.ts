import { useEffect, useState } from "react";
import type { CurrentWeather } from "../types/weather";
import type { City } from "../types/city";
import { fetchCurrentCityWeather } from "../api/weather";
import { useSettings } from "../context/SettingsContext";

export const useFavoriteWeather = (city: City | null) => {
  const { unit } = useSettings(); // 🔥 ambil unit dari settings

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
        const data = await fetchCurrentCityWeather(
          city,
          undefined, // pakai BASE_URL default
          unit       // 🔥 INI KUNCI
        );

        if (!cancelled) {
          setWeather(data);
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
  }, [city, unit]); // 🔥 unit jadi dependency

  return { weather, loading, error };
};