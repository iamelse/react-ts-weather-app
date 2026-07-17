import type { Location } from "../types/location";

const LOCATION_BASE_URL =
  import.meta.env.VITE_LOCATION_BASE_URL ??
  "https://nominatim.openstreetmap.org/search";

const REVERSE_BASE_URL =
  "https://nominatim.openstreetmap.org/reverse";

export const fetchLocations = async (
  query: string,
  signal?: AbortSignal
): Promise<Location[]> => {
  if (!query.trim()) return [];

  const res = await fetch(
    `${LOCATION_BASE_URL}?q=${encodeURIComponent(
      query
    )}&format=json&limit=5`,
    {
      signal,
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch locations");
  }

  return res.json();
};

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<Location | null> => {
  const res = await fetch(
    `${REVERSE_BASE_URL}?lat=${lat}&lon=${lon}&format=json`,
    { headers: { Accept: "application/json" } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  if (!data || data.error) return null;

  return {
    lat: String(lat),
    lon: String(lon),
    display_name: data.display_name ?? `${lat}, ${lon}`,
  };
};
