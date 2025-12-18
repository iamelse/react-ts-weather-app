import { useEffect, useState } from "react";
import type { City } from "../types/city";
import { getStoredCities, saveCities } from "../utils/cityStorage";

const fallbackCity: City = {
  name: "Cilacap",
  country: "Indonesia",
  latitude: -7.7197,
  longitude: 109.0142,
  is_favorite: true,
};

export function useCitiesStorage() {
  const [cities, setCities] = useState<City[]>(() => {
    const stored = getStoredCities();
    return stored && stored.length ? stored : [fallbackCity];
  });

  const favoriteCity = cities.find(c => c.is_favorite);

  const [activeCity, setActiveCity] = useState<City | undefined>(
    favoriteCity ?? cities[0]
  );

  useEffect(() => {
    saveCities(cities);
  }, [cities]);

  // kalau favorite berubah, sync active (saat pertama load)
  useEffect(() => {
    if (!activeCity && favoriteCity) {
      setActiveCity(favoriteCity);
    }
  }, [favoriteCity, activeCity]);

  /* ================= ACTIONS ================= */

  // klik city list → cuma ganti active
  const selectCity = (city: City) => {
    setActiveCity(city);
  };

  // set favorite (misalnya dari modal)
  const setFavoriteCity = (city: City) => {
    setCities(prev =>
      prev.map(c => ({
        ...c,
        is_favorite:
          c.latitude === city.latitude &&
          c.longitude === city.longitude,
      }))
    );
    setActiveCity(city);
  };

  const updateCities = (next: City[]) => {
    setCities(next);
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