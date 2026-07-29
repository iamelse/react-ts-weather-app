import { useEffect, useState, useCallback } from "react";
import type { City } from "../types/city";
import { reverseGeocode } from "../api/location";

export function useInitialLocation() {
  const [detectedCity, setDetectedCity] = useState<City | null>(null);
  const [detecting, setDetecting] = useState(true);
  const [geoLocated, setGeoLocated] = useState(false);
  const [geoDenied, setGeoDenied] = useState(false);

  const detectPosition = useCallback(async (): Promise<City | null> => {
    if (!navigator.geolocation) return null;

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
        });
      });

      const loc = await reverseGeocode(
        pos.coords.latitude,
        pos.coords.longitude
      );

      if (!loc) return null;

      return {
        name: loc.display_name,
        country: "",
        latitude: +loc.lat,
        longitude: +loc.lon,
        is_favorite: false,
      };
    } catch (err) {
      if (
        err instanceof GeolocationPositionError &&
        err.code === GeolocationPositionError.PERMISSION_DENIED
      ) {
        setGeoDenied(true);
      }
      return null;
    }
  }, []);

  const requestLocation = useCallback(async (): Promise<City | null> => {
    const city = await detectPosition();
    if (city) {
      setDetectedCity(city);
      setGeoLocated(true);
      setGeoDenied(false);
    }
    return city;
  }, [detectPosition]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setTimeout(() => setDetecting(false), 0);
      return;
    }

    let cancelled = false;

    const run = async () => {
      let permissionState = "prompt";
      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        } as PermissionDescriptor);
        permissionState = result.state;
      } catch {
        // Permissions API not supported — treat as prompt
      }

      if (cancelled) return;

      if (permissionState === "granted") {
        const city = await detectPosition();
        if (!cancelled && city) {
          setDetectedCity(city);
          setGeoLocated(true);
        }
      } else if (permissionState === "denied") {
        setGeoDenied(true);
      }
      // "prompt" → don't auto-call, wait for user action

      if (!cancelled) setDetecting(false);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [detectPosition]);

  return { detectedCity, detecting, geoLocated, geoDenied, requestLocation };
}
