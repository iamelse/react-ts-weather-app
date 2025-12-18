export interface CurrentWeather {
  temp: number;
  code: number;
  is_day?: boolean;
}

export type BackgroundGradient = {
  from: string;
  to: string;
};

export type DayPhase = "night" | "dawn" | "day" | "dusk";

/* =======================
   WEATHER INFO
======================= */
export interface WeatherInfo {
  icon: string;
  text: string;
}

/* =======================
   HOURLY
======================= */
export interface HourlyItem {
  time: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;

  icon: string;
  text?: string;
  code?: number;

  is_day?: boolean;
}

/* =======================
   WEEKLY
======================= */
export interface WeeklyItemType {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;

  icon?: string;
  text?: string;
  code?: number;

  is_day?: boolean;
}

/* =======================
   WEATHER STATE
======================= */
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

  current_icon?: string;
  current_text?: string;
  current_code?: number;
  is_day?: boolean;
}