import { useEffect, useState } from "react";
import type { City } from "../types/city";
import { getStoredCities, saveCities } from "../utils/cityStorage";
import { reverseGeocode } from "../api/location";

export function useInitialLocation() {
  const [detectedCity, setDetectedCity] = useState<City | null>(null);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    const stored = getStoredCities();
    if (stored && stored.length > 0) {
      setTimeout(() => setDetecting(false), 0);
      return;
    }

    if (!navigator.geolocation) {
      setTimeout(() => setDetecting(false), 0);
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;

        try {
          const loc = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude
          );

          if (!cancelled && loc) {
            const city: City = {
              name: loc.display_name,
              country: "",
              latitude: +loc.lat,
              longitude: +loc.lon,
              is_favorite: true,
            };

            saveCities([city]);
            setDetectedCity(city);
          }
        } catch {
          // reverse geocode failed, use fallback
        }

        if (!cancelled) setDetecting(false);
      },
      () => {
        if (!cancelled) setDetecting(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return { detectedCity, detecting };
}
