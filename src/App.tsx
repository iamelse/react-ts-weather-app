import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar/Sidebar";
import WeatherHeader from "./components/WeatherHeader/WeatherHeader";
import HourlyChart from "./components/HourlyChart/HourlyChart";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import type { WeatherState, City } from "./types/weather";
import { getBackgroundByWeather } from "./utils/weather";
import { useDayPhase } from "./hooks/useDayPhase";
import {
  fetchCurrentWeather,
  fetchHourlyWeather,
  fetchWeeklyWeather,
} from "./api/weather";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState<City>({
    name: "Cilacap",
    country: "Indonesia",
    latitude: -7.7197,
    longitude: 109.0142,
  });

  const [weather, setWeather] = useState<WeatherState>({
    hourly: [],
    weekly: [],
    temp: 0,
    feels_like: 0,
    wind_speed: 0,
    humidity: 0,
    uv_index: 0,
    sunrise: "N/A",
    sunset: "N/A",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  /* =======================
     FETCH WEATHER
  ======================= */

  useEffect(() => {
    const { latitude, longitude } = selectedCity;

    fetchCurrentWeather(latitude, longitude, BASE_URL)
      .then((data) => setWeather((prev) => ({ ...prev, ...data })));

    fetchHourlyWeather(latitude, longitude, BASE_URL)
      .then((hourly) => setWeather((prev) => ({ ...prev, hourly })));

    fetchWeeklyWeather(latitude, longitude, BASE_URL)
      .then((weekly) => setWeather((prev) => ({ ...prev, weekly })));
  }, [selectedCity, BASE_URL]);

  /* =======================
     SIDEBAR HANDLER ✅
  ======================= */

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setMenuOpen(false); // ⬅️ auto close
  };

  /* =======================
     BACKGROUND (TIME + WEATHER)
  ======================= */

  const phase = useDayPhase();
  const bgGradient = getBackgroundByWeather(weather.current_code, phase);

  return (
    <div
      className="min-h-screen w-full text-white relative transition-colors duration-700"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to})`,
      }}
    >
      {/* BACKDROP */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-10 transition-opacity duration-300
        ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <Sidebar
        menuOpen={menuOpen}
        selectedCity={selectedCity}
        handleSelect={handleSelectCity}
      />

      {/* MENU BUTTON */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur hover:bg-white/20 transition"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="px-4 py-10 flex flex-col items-center relative z-0">
        <WeatherHeader weather={weather} selectedCity={selectedCity} />
        <HourlyChart hourly={weather.hourly} />
        <WeeklyForecast weekly={weather.weekly} />
      </div>
    </div>
  );
}