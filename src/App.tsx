import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "./components/Sidebar/Sidebar";
import WeatherHeader from "./components/WeatherHeader/WeatherHeader";
import HourlyChart from "./components/HourlyChart/HourlyChart";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import ManageLocationModal from "./components/Modal/ManageLocationModal";

import type { City } from "./types/weather";
import { getBackgroundByWeather } from "./utils/weather";
import { useDayPhase } from "./hooks/useDayPhase";
import { useWeather } from "./hooks/useWeather";
import { getStoredCities, saveCities } from "./utils/cityStorage";

const fallbackCity: City = {
  name: "Cilacap",
  country: "Indonesia",
  latitude: -7.7197,
  longitude: 109.0142,
  is_favorite: true,
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ==========================
     CITIES (SOURCE OF TRUTH)
  ========================== */
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const stored = getStoredCities() ?? [];
    setCities(stored.length ? stored : [fallbackCity]);
  }, []);

  /* ==========================
     SELECTED CITY
  ========================== */
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    const stored = getStoredCities() ?? [];
    return stored.find((c) => c.is_favorite) ?? fallbackCity;
  });

  /* ==========================
     UPDATE FROM MODAL
  ========================== */
  const handleCitiesUpdate = (updated: City[]) => {
    setCities(updated);
    saveCities(updated);

    const favorite = updated.find((c) => c.is_favorite);
    if (favorite) setSelectedCity(favorite);
  };

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setMenuOpen(false);
  };

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
        handleSelect={handleSelectCity}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* OVERLAY */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-20
          bg-black/10 backdrop-blur-sm
          transition-opacity duration-500
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* HAMBURGER (GESER SAAT SIDEBAR OPEN) */}
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

      {/* MAIN CONTENT */}
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
        onCitiesUpdate={handleCitiesUpdate}
      />
    </div>
  );
}