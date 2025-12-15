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

    setCities(stored.length > 0 ? stored : [fallbackCity]);
  }, []);

  /* ==========================
     SELECTED CITY
  ========================== */
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    const stored = getStoredCities() ?? [];

    return (
      stored.find((c) => c.is_favorite) ??
      fallbackCity
    );
  });

  /* ==========================
     UPDATE CITIES (FROM MODAL)
  ========================== */
  const handleCitiesUpdate = (updated: City[]) => {
    setCities(updated);
    saveCities(updated);

    const favorite = updated.find((c) => c.is_favorite);
    if (favorite) {
      setSelectedCity(favorite);
    }
  };

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setMenuOpen(false);
  };

  /* ==========================
     WEATHER & UI
  ========================== */
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { weather, loading, error } = useWeather(selectedCity, BASE_URL);

  const phase = useDayPhase();
  const bgGradient = getBackgroundByWeather(
    weather.current_code,
    phase
  );

  return (
    <div
      className="min-h-screen w-full text-white"
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

      {/* MENU BUTTON */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* MAIN */}
      <div className="px-4 py-10 flex flex-col items-center">
        {loading && <p>Loading weather...</p>}
        {error && <p className="text-red-400">{error}</p>}

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