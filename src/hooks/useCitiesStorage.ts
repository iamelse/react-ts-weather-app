import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
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
    setCities([detectedCity]);
  }, [detectedCity]);

  const favoriteCity = useMemo(
    () => cities.find((c) => c.is_favorite),
    [cities]
  );

  const [activeCity, setActiveCity] = useState<City | undefined>(
    () => favoriteCity ?? cities[0]
  );

  const geoApplied = useRef(false);

  const persist = (next: City[]) => {
    saveCities(next);
    setCities(next);
  };

  const promoteToFavorite = useCallback((city: City) => {
    const stored = getStoredCities();
    if (stored && stored.length > 0) {
      const exists = stored.some(
        (c) => c.latitude === city.latitude && c.longitude === city.longitude
      );
      const updated = stored.map((c) => ({
        ...c,
        is_favorite: false,
      }));
      if (exists) {
        for (const c of updated) {
          if (c.latitude === city.latitude && c.longitude === city.longitude) {
            c.is_favorite = true;
            break;
          }
        }
      } else {
        updated.push({ ...city, is_favorite: true });
      }
      persist(updated);
    } else {
      persist([{ ...city, is_favorite: true }]);
    }
  }, []);

  useLayoutEffect(() => {
    if (geoLocated && detectedCity && !geoApplied.current) {
      geoApplied.current = true;
      promoteToFavorite(detectedCity);
      setActiveCity(detectedCity);
    }
  }, [detectedCity, geoLocated, promoteToFavorite]);

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
    geoApplied.current = true;
    promoteToFavorite(city);
    setActiveCity(city);
  }, [promoteToFavorite]);

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
