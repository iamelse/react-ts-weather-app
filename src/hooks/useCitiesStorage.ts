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
    const stored = getStoredCities() ?? [];
    return stored.length ? stored : [fallbackCity];
  });

  // sync ke localStorage
  useEffect(() => {
    saveCities(cities);
  }, [cities]);

  const selectedCity =
    cities.find((c) => c.is_favorite) ?? cities[0];

  /* ==========================
     ACTIONS
  ========================== */

  const updateCities = (updated: City[]) => {
    setCities(updated);
  };

  const selectCity = (city: City) => {
    setCities((prev) =>
      prev.map((c) => ({
        ...c,
        is_favorite:
          c.latitude === city.latitude &&
          c.longitude === city.longitude,
      }))
    );
  };

  return {
    cities,
    selectedCity,
    updateCities,
    selectCity,
  };
}