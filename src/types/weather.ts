export interface CurrentWeather {
  temp: number;
  code: number;
  is_day?: 0 | 1;
}

export type BackgroundGradient = {
  from: string;
  to: string;
};

export type DayPhase = "night" | "dawn" | "day" | "dusk";

export interface WeatherInfo {
  icon: string;
  text: string;
}

export interface HourlyItem {
  time: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  precip_prob?: number;
  icon: string;
  text?: string;
  code?: number;
  is_day?: 0 | 1;
}

export interface WeeklyItemType {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  icon?: string;
  text?: string;
  code?: number;
  is_day?: 0 | 1;
}

export interface AQIData {
  aqi: number;
  level: string;
  pm2_5: number;
  pm10: number;
}

export interface WeatherState {
  hourly: HourlyItem[];
  weekly: WeeklyItemType[];

  temp: number;
  feels_like: number;
  wind_speed: number;
  wind_direction: number;
  humidity: number;
  uv_index: number;

  sunrise: string;
  sunset: string;

  current_icon?: string;
  current_text?: string;
  current_code?: number;
  is_day?: 0 | 1;

  aqi?: AQIData;
}
