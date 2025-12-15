import type { LucideIcon } from "lucide-react";

export interface CurrentWeather {
  temp: number;
  code: number;
}

export interface City {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  current_code?: number;
  current_temp?: number;
}

export type BackgroundGradient = {
  from: string;
  to: string;
};

export type DayPhase = "night" | "dawn" | "day" | "dusk";

export interface WeatherInfo {
  icon: LucideIcon;
  text: string;
}

export interface HourlyItem {
  time: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  icon: LucideIcon;
  text?: string;
}

export interface WeeklyItemType {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  icon?: LucideIcon;
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
  current_icon?: LucideIcon;
  current_text?: string;
  current_code?: number;
  is_day?: boolean;
}