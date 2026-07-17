import { useState, useCallback } from "react";
import type { Location } from "../types/location";
import { reverseGeocode } from "../api/location";

interface AutoDetectState {
  loading: boolean;
  error: string | null;
}

export function useAutoDetectLocation() {
  const [state, setState] = useState<AutoDetectState>({
    loading: false,
    error: null,
  });

  const detect = useCallback(async (): Promise<Location | null> => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: "Geolocation not supported" });
      return null;
    }

    setState({ loading: true, error: null });

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

      setState({ loading: false, error: null });
      return loc;
    } catch (err) {
      const message =
        err instanceof GeolocationPositionError
          ? err.code === err.PERMISSION_DENIED
            ? "Location permission denied"
            : "Could not detect location"
          : "Detection failed";

      setState({ loading: false, error: message });
      return null;
    }
  }, []);

  return { ...state, detect };
}
