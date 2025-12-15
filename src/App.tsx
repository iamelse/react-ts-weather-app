import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar/Sidebar";
import WeatherHeader from "./components/WeatherHeader/WeatherHeader";
import HourlyChart from "./components/HourlyChart/HourlyChart";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import type { City } from "./types/weather";
import { getBackgroundByWeather } from "./utils/weather";
import { useDayPhase } from "./hooks/useDayPhase";
import { useWeather } from "./hooks/useWeather";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedCity, setSelectedCity] = useState<City>({
    name: "Cilacap",
    country: "Indonesia",
    latitude: -7.7197,
    longitude: 109.0142,
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  /* =======================
     HOOK: FETCH WEATHER
  ======================= */
  const { weather, loading, error } = useWeather(selectedCity, BASE_URL);

  /* =======================
     SIDEBAR HANDLER
  ======================= */
  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setMenuOpen(false);
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
        {loading && <p className="text-white/80 mb-4">Loading weather...</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <WeatherHeader weather={weather} selectedCity={selectedCity} />
        <HourlyChart hourly={weather.hourly} />
        <WeeklyForecast weekly={weather.weekly} />
      </div>
    </div>
  );
}