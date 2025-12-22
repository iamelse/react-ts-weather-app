import { useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "./components/Sidebar/Sidebar";
import WeatherHeader from "./components/WeatherHeader/WeatherHeader";
import HourlyChart from "./components/HourlyChart/HourlyChart";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import ManageLocationModal from "./components/Modal/ManageLocationModal";
import FavoriteLocationInfoModal from "./components/Modal/FavoriteLocationInfoModal";

import { getBackgroundByWeather } from "./utils/weather";
import { useDayPhase } from "./hooks/useDayPhase";
import { useWeather } from "./hooks/useWeather";
import { useCitiesStorage } from "./hooks/useCitiesStorage";
import type { City } from "./types/city";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoCity, setInfoCity] = useState<City | null>(null);

  const { cities, activeCity, updateCities, selectCity } = useCitiesStorage();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { weather, loading, error } = useWeather(activeCity, BASE_URL);
  const phase = useDayPhase();
  const bgGradient = getBackgroundByWeather(weather.current_code, phase);

  const toggleMenu = () => {
    setMenuOpen((v) => !v);
  };

  const transformStyle = {
    transform: menuOpen ? "translateX(288px)" : "translateX(0)",
    transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)", // lebih smooth
    willChange: "transform",
  };

  return (
    <div
      className="min-h-screen w-full text-white relative overflow-x-hidden"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to})`,
      }}
    >
      {/* SIDEBAR */}
      <Sidebar
        menuOpen={menuOpen}
        cities={cities}
        selectedCity={activeCity}
        onSelectCity={(city) => {
          selectCity(city);
          setMenuOpen(false);
        }}
        onOpenModal={() => setIsModalOpen(true)}
        onOpenInfoModal={(city) => {
          setInfoCity(city);
          setInfoModalOpen(true);
        }}
        bgGradient={bgGradient}
      />

      {/* OVERLAY */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-250 ease-out ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* HAMBURGER BUTTON */}
      <button
        onClick={toggleMenu}
        className={`fixed top-2 left-2 z-50 p-2 rounded-lg transition-transform duration-350 hover:transition-transform ease-in-out`}
        style={transformStyle}
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* MAIN CONTENT */}
      <div
        className="pt-24 px-4 flex flex-col items-center relative z-10"
        style={transformStyle}
      >
        {loading && <p className="text-white/70">Loading weather...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <WeatherHeader weather={weather} selectedCity={activeCity} />
        <HourlyChart hourly={weather.hourly} />
        <WeeklyForecast weekly={weather.weekly} />
      </div>

      {/* MODALS */}
      {isModalOpen && (
        <ManageLocationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bgGradient={bgGradient}
          cities={cities}
          onCitiesUpdate={updateCities}
        />
      )}

      {infoModalOpen && infoCity && (
        <FavoriteLocationInfoModal
          isOpen={infoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          favoriteCity={infoCity}
          bgGradient={bgGradient}
        />
      )}
    </div>
  );
}