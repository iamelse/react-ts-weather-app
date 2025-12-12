import { Icon } from "lucide-react";

export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  current_code?: number;
  current_temp?: number;
}

export interface BackgroundGradient {
  from: string;
  to: string;
}

export interface HourlyItem {
  time: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  icon: typeof Icon; // <- pakai typeof
  text?: string;
}

export interface WeeklyItemType {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  icon?: typeof Icon; // <- pakai typeof
  text?: string;
  code?: number;
}

export interface WeatherState {
  hourly: HourlyItem[];
  weekly: WeeklyItemType[];
  temp: number;
  feels_like: number;
  wind_speed: number;
  humidity: number;
  uv_index: number;
  sunrise: string;
  sunset: string;
  current_icon?: typeof Icon; // <- pakai typeof
  current_text?: string;
  current_code?: number;
  is_day?: boolean;
}

export interface WeatherInfo {
  icon: any;
  text: string;
}