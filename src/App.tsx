import { useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "./components/Sidebar/Sidebar";
import WeatherHeader from "./components/WeatherHeader/WeatherHeader";
import HourlyChart from "./components/HourlyChart/HourlyChart";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import ManageLocationModal from "./components/Modal/ManageLocationModal";

import { getBackgroundByWeather } from "./utils/weather";
import { useDayPhase } from "./hooks/useDayPhase";
import { useWeather } from "./hooks/useWeather";
import { useCitiesStorage } from "./hooks/useCitiesStorage";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cities, activeCity, updateCities, selectCity } = useCitiesStorage();

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { weather, loading, error } = useWeather(activeCity, BASE_URL);

  const phase = useDayPhase();
  const bgGradient = getBackgroundByWeather(weather.current_code, phase);

  return (
    <div
      className="min-h-screen w-full text-white relative"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to})`,
      }}
    >
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        menuOpen={menuOpen}
        cities={cities}
        selectedCity={activeCity}
        onSelectCity={(city) => {
          selectCity(city);
          setMenuOpen(false);
        }}
        onOpenModal={() => setIsModalOpen(true)}
        bgGradient={bgGradient}
      />

      {/* ===== OVERLAY ===== */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30
          bg-black/30
          transition-opacity duration-500 ease-out
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ===== HAMBURGER BUTTON ===== */}
      <button
        onClick={() => setMenuOpen(v => !v)}
        className={`fixed top-4 left-2 z-50 p-2 rounded-lg
          bg-transparent hover:bg-white/30
          transition-transform duration-500 ease-out
          ${menuOpen ? "translate-x-72" : "translate-x-0"}
        `}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* ===== MAIN CONTENT ===== */}
      <div
        className={`pt-24 px-4 flex flex-col items-center relative z-10
          transition-transform duration-500 ease-out
          ${menuOpen ? "scale-[0.98]" : "scale-100"}
        `}
      >
        {loading && <p className="text-white/70">Loading weather...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <WeatherHeader weather={weather} selectedCity={activeCity} />
        <HourlyChart hourly={weather.hourly} />
        <WeeklyForecast weekly={weather.weekly} />
      </div>

      {/* ===== MODAL ===== */}
      <ManageLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bgGradient={bgGradient}
        cities={cities}
        onCitiesUpdate={updateCities}
      />
    </div>
  );
}