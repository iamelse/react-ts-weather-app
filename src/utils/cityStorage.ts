import type { City } from "../types/city";

const STORAGE_KEY = "weather_cities";

export function getStoredCities(): City[] | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveCities(cities: City[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}