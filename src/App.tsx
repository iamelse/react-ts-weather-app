import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar/Sidebar";
import WeatherHeader from "./components/WeatherHeader/WeatherHeader";
import HourlyChart from "./components/HourlyChart/HourlyChart";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import type { WeatherState } from "./types/weather";
import { getBackgroundByWeather } from "./utils/weather";
import { fetchCurrentWeather, fetchHourlyWeather, fetchWeeklyWeather } from "./api/weather";
import "./App.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any | null>({
    name: "Cilacap",
    latitude: -7.7197, 
    longitude: 109.0142
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
  const [loading, setLoading] = useState(true);
  const [hourlyLoaded, setHourlyLoaded] = useState(false);
  const [weeklyLoaded, setWeeklyLoaded] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const getFormattedDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const handleSelect = (city: any) => {
    setSelectedCity(city);
    setWeather({
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
    setLoading(true);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!selectedCity) return;
    const { latitude, longitude } = selectedCity;

    fetchCurrentWeather(latitude, longitude, BASE_URL)
      .then(data => setWeather(prev => ({ ...prev, ...data })))
      .catch(err => console.error("Failed to fetch current weather:", err));

    setHourlyLoaded(false);
    fetchHourlyWeather(latitude, longitude, BASE_URL)
      .then(hourly => setWeather(prev => ({ ...prev, hourly, wind_speed: hourly.length > 0 ? hourly[0].wind_speed : 0 })))
      .finally(() => setHourlyLoaded(true))
      .catch(err => console.error(err));

    setWeeklyLoaded(false);
    fetchWeeklyWeather(latitude, longitude, BASE_URL)
      .then(weekly => setWeather(prev => ({ ...prev, weekly })))
      .finally(() => setWeeklyLoaded(true))
      .catch(err => console.error(err));
  }, [selectedCity, BASE_URL]);

  useEffect(() => {
    if (hourlyLoaded && weeklyLoaded) setLoading(false);
  }, [hourlyLoaded, weeklyLoaded]);

  const bgGradient = getBackgroundByWeather(weather.current_code, weather.is_day);

  return (
    <div
      className="min-h-screen w-full text-white relative"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to})`,
      }}
    >
      <Sidebar menuOpen={menuOpen} handleSelect={handleSelect} selectedCity={selectedCity} />

      {/* HAMBURGER */}
      <button
        className={`fixed top-4 p-2 rounded-lg bg-white/10 backdrop-blur-sm z-50 transition-transform duration-300 ${
          menuOpen ? "left-72 mx-3.5" : "left-4"
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu strokeWidth={1} className="w-5 h-5 text-white" />
      </button>

      <div
        className={`px-4 py-10 flex flex-col items-center transition-transform duration-300 ${
          menuOpen ? "translate-x-72" : "translate-x-0"
        }`}
      >
        {loading ? (
          <p>Loading weather data...</p>
        ) : weather ? (
          <>
            <WeatherHeader
              weather={weather}
              selectedCity={selectedCity}
              getFormattedDate={getFormattedDate}
            />
            <HourlyChart hourly={weather.hourly} />
            <WeeklyForecast weekly={weather.weekly} />
          </>
        ) : (
          <p>Weather data not available</p>
        )}
      </div>
    </div>
  );
}