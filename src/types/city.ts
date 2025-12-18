export interface City {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  current_code?: number;
  current_temp?: number;
  is_favorite?: boolean;
  is_day?: boolean;
}