import { useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "./components/Sidebar/Sidebar";
import WeatherHeader from "./components/WeatherHeader/WeatherHeader";
import HourlyChart from "./components/HourlyChart/HourlyChart";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import ManageLocationModal from "./components/Modal/ManageLocationModal";
import FavoriteLocationInfoModal from "./components/Modal/FavoriteLocationInfoModal";
import SettingModal from "./components/Modal/SettingsModal";

import { getBackgroundByWeather } from "./utils/weather";
import { useDayPhase } from "./hooks/useDayPhase";
import { useWeather } from "./hooks/useWeather";
import { useCitiesStorage } from "./hooks/useCitiesStorage";
import type { City } from "./types/city";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [infoCity, setInfoCity] = useState<City | null>(null);

  const { cities, activeCity, updateCities, selectCity } =
    useCitiesStorage();

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { weather, loading, error } = useWeather(activeCity, BASE_URL);
  const phase = useDayPhase();
  const bgGradient = getBackgroundByWeather(weather.current_code, phase);

  const toggleMenu = () => setMenuOpen((v) => !v);

  return (
    <div
      className="min-h-screen w-full text-white relative overflow-x-hidden"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to})`,
      }}
    >
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        menuOpen={menuOpen}
        cities={cities}
        selectedCity={activeCity}
        onSelectCity={(city) => {
          selectCity(city);
          setMenuOpen(false);
        }}
        onOpenModal={() => setIsModalOpen(true)}
        onOpenSettingModal={() => setSettingModalOpen(true)}
        onOpenInfoModal={(city) => {
          setInfoCity(city);
          setInfoModalOpen(true);
        }}
        bgGradient={bgGradient}
      />

      {/* ================= OVERLAY ================= */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300
          ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* ================= HAMBURGER ================= */}
      <button
        onClick={toggleMenu}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg hover:bg-white/20"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* ================= CONTENT (STATIC) ================= */}
      <main className="pt-24 px-4 flex flex-col items-center relative z-10">
        {loading && <p className="text-white/70">Loading weather...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <WeatherHeader weather={weather} selectedCity={activeCity} />
        <HourlyChart hourly={weather.hourly} />
        <WeeklyForecast weekly={weather.weekly} />
      </main>

      {/* ================= MODALS ================= */}
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

      {settingModalOpen && (
        <SettingModal
          isOpen={settingModalOpen}
          onClose={() => setSettingModalOpen(false)}
          bgGradient={bgGradient}
        />
      )}
    </div>
  );
}