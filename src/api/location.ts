import type { Location } from "../types/location";

/* ==========================
   BASE URL
========================== */
const LOCATION_BASE_URL =
  import.meta.env.VITE_LOCATION_BASE_URL ??
  "https://nominatim.openstreetmap.org/search";

/* ==========================
   FETCH LOCATION SEARCH
========================== */
export const fetchLocations = async (
  query: string
): Promise<Location[]> => {
  if (!query.trim()) return [];

  const res = await fetch(
    `${LOCATION_BASE_URL}?q=${encodeURIComponent(
      query
    )}&format=json&limit=5`,
    {
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