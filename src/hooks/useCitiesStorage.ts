import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { City } from "../types/city";
import { getStoredCities, saveCities } from "../utils/cityStorage";

const fallbackCity: City = {
  name: "Cilacap",
  country: "Indonesia",
  latitude: -7.7197,
  longitude: 109.0142,
  is_favorite: true,
};

export function useCitiesStorage(
  detectedCity?: City | null,
  geoLocated = false
) {
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

  const geoApplied = useRef(false);

  useEffect(() => {
    if (geoLocated && detectedCity && !geoApplied.current) {
      geoApplied.current = true;
      setTimeout(() => setActiveCity(detectedCity), 0);
    }
  }, [detectedCity, geoLocated]);

  const persist = (next: City[]) => {
    saveCities(next);
    setCities(next);
  };

  const selectCity = (city: City) => {
    geoApplied.current = true;
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

  const overrideWithGeoCity = useCallback((city: City) => {
    geoApplied.current = false;
    setActiveCity(city);
  }, []);

  return {
    cities,
    activeCity,
    favoriteCity,
    selectCity,
    setFavoriteCity,
    updateCities,
    overrideWithGeoCity,
  };
}
