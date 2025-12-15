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

  /* ==========================
     CITIES (HOOK)
  ========================== */
  const {
    cities,
    selectedCity,
    updateCities,
    selectCity,
  } = useCitiesStorage();

  /* ==========================
     WEATHER
  ========================== */
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { weather, loading, error } =
    useWeather(selectedCity, BASE_URL);

  const phase = useDayPhase();
  const bgGradient = getBackgroundByWeather(
    weather.current_code,
    phase
  );

  return (
    <div
      className="min-h-screen w-full text-white relative"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to})`,
      }}
    >
      {/* SIDEBAR */}
      <Sidebar
        menuOpen={menuOpen}
        cities={cities}
        selectedCity={selectedCity}
        handleSelect={(city) => {
          selectCity(city);
          setMenuOpen(false);
        }}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* OVERLAY */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-20
          bg-black/10 backdrop-blur-sm
          transition-opacity duration-500
          ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* HAMBURGER */}
      <button
        className={`fixed top-4 z-50 p-2 rounded-lg
          bg-white/10 backdrop-blur
          transition-all duration-500 ease-out
          ${menuOpen ? "ms-4 left-72" : "left-4"}
        `}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* MAIN */}
      <div className="px-4 py-10 flex flex-col items-center">
        {loading && (
          <p className="text-white/70">
            Loading weather...
          </p>
        )}
        {error && (
          <p className="text-red-400">
            {error}
          </p>
        )}

        <WeatherHeader
          weather={weather}
          selectedCity={selectedCity}
        />
        <HourlyChart hourly={weather.hourly} />
        <WeeklyForecast weekly={weather.weekly} />
      </div>

      {/* MODAL */}
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