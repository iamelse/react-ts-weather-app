import { useEffect, useMemo, useRef, useState } from "react";
import type { City } from "../types/city";
import { getStoredCities, saveCities } from "../utils/cityStorage";

const fallbackCity: City = {
  name: "Cilacap",
  country: "Indonesia",
  latitude: -7.7197,
  longitude: 109.0142,
  is_favorite: true,
};

export function useCitiesStorage(detectedCity?: City | null) {
  const [cities, setCities] = useState<City[]>(() => {
    const stored = getStoredCities();
    return stored && stored.length ? stored : [fallbackCity];
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    const stored = getStoredCities();
    if (stored && stored.length > 0) {
      initialized.current = true;
      return;
    }
    if (!detectedCity) return;

    initialized.current = true;
    setTimeout(() => setCities([detectedCity]), 0);
  }, [detectedCity]);

  const favoriteCity = useMemo(
    () => cities.find((c) => c.is_favorite),
    [cities]
  );

  const [activeCity, setActiveCity] = useState<City | undefined>(
    () => favoriteCity ?? cities[0]
  );

  const persist = (next: City[]) => {
    saveCities(next);
    setCities(next);
  };

  const selectCity = (city: City) => {
    setActiveCity(city);
  };

  const setFavoriteCity = (city: City) => {
    persist(
      cities.map((c) => ({
        ...c,
        is_favorite:
          c.latitude === city.latitude &&
          c.longitude === city.longitude,
      }))
    );
    setActiveCity(city);
  };

  const updateCities = (next: City[]) => {
    persist(next);
  };

  return {
    cities,
    activeCity,
    favoriteCity,
    selectCity,
    setFavoriteCity,
    updateCities,
  };
}
