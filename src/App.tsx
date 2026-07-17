import { useState, useCallback } from "react";
import { Menu, Loader2 } from "lucide-react";

import Sidebar from "./components/Sidebar/Sidebar";
import WeatherHeader from "./components/WeatherHeader/WeatherHeader";
import WeatherHeaderSkeleton from "./components/WeatherHeader/WeatherHeaderSkeleton";
import HourlyChart from "./components/HourlyChart/HourlyChart";
import HourlyChartSkeleton from "./components/HourlyChart/HourlyChartSkeleton";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import WeeklyForecastSkeleton from "./components/WeeklyForecast/WeeklyForecastSkeleton";
import InfoCards from "./components/InfoCards/InfoCards";
import InfoCardsSkeleton from "./components/InfoCards/InfoCardsSkeleton";
import ManageLocationModal from "./components/Modal/ManageLocationModal";
import SettingsModal from "./components/Modal/SettingsModal";
import PullToRefreshIndicator from "./components/PullToRefreshIndicator";
import ShareFab from "./components/ShareFab";

import { getBackgroundByWeather, getWeatherInfo } from "./utils/weather";
import { formatTempDisplay } from "./utils";
import { formatLocationName } from "./utils/location";
import { useDayPhase } from "./hooks/useDayPhase";
import { useWeather } from "./hooks/useWeather";
import { useCitiesStorage } from "./hooks/useCitiesStorage";
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import { useInitialLocation } from "./hooks/useInitialLocation";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"manage" | "settings" | null>(null);
  const [forecastDays, setForecastDays] = useState(7);

  const { detectedCity, detecting } = useInitialLocation();
  const { cities, activeCity, updateCities, selectCity } =
    useCitiesStorage(detectedCity);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.open-meteo.com/v1/forecast";
  const { weather, loading, error, refresh } = useWeather(activeCity, BASE_URL, forecastDays);
  const phase = useDayPhase();
  const bgGradient = getBackgroundByWeather(weather.current_code, phase);

  const {
    state: ptrState,
    pullDistance,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = usePullToRefresh(refresh);

  const toggleMenu = () => setMenuOpen((v) => !v);

  const handleShare = useCallback(async () => {
    if (!activeCity) return;
    const weatherInfo = getWeatherInfo(weather.current_code, weather.is_day ?? 1);
    const temp = formatTempDisplay(weather.temp);
    const text = `${temp}° · ${weatherInfo.text} · ${formatLocationName(activeCity.name)}`;

    if (navigator.share) {
      try { await navigator.share({ title: "Weather", text }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
    }
  }, [weather, activeCity]);

  if (detecting) {
    return (
      <div
        className="min-h-screen w-full text-white flex flex-col items-center justify-center gap-3"
        style={{
          background: `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to})`,
        }}
      >
        <Loader2 className="w-6 h-6 animate-spin text-white/70" strokeWidth={2} />
        <p className="text-sm text-white/60">Detecting your location...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full text-white relative overflow-x-hidden"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to})`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
        onOpenModal={() => setActiveModal("manage")}
        onOpenSettingModal={() => setActiveModal("settings")}
        bgGradient={bgGradient}
        onClose={() => setMenuOpen(false)}
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
        className={`fixed top-3 left-3 z-50 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300
          ${menuOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100"}
        `}
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* ================= PULL TO REFRESH ================= */}
      <PullToRefreshIndicator state={ptrState} pullDistance={pullDistance} />

      {/* ================= CONTENT ================= */}
      <main className="pt-14 sm:pt-16 px-4 sm:px-6 md:px-8 pb-8 flex flex-col items-center relative z-10">
        {error && <p className="text-red-400">{error}</p>}

        {loading ? (
          <>
            <WeatherHeaderSkeleton />
            <HourlyChartSkeleton />
            <WeeklyForecastSkeleton />
            <InfoCardsSkeleton />
          </>
        ) : (
          <>
            {/* 1. CURRENT CONDITIONS — suhu, cuaca, lokasi */}
            <WeatherHeader weather={weather} selectedCity={activeCity} />

            {/* 2. HOURLY — 24 jam ke depan */}
            <HourlyChart hourly={weather.hourly} />

            {/* 3. WEEKLY — 7/16 hari ke depan */}
            <WeeklyForecast
              weekly={weather.weekly}
              onToggleDays={() =>
                setForecastDays((d) => (d === 7 ? 16 : 7))
              }
              forecastDays={forecastDays}
            />

            {/* 4. DETAILS — UV, humidity, wind, AQI, sunrise/sunset */}
            <InfoCards weather={weather} />
          </>
        )}
      </main>

      {/* ================= SHARE FAB ================= */}
      {!loading && activeCity && <ShareFab onShare={handleShare} />}

      {/* ================= MODALS ================= */}
      <ManageLocationModal
        isOpen={activeModal === "manage"}
        onClose={() => setActiveModal(null)}
        bgGradient={bgGradient}
        cities={cities}
        onCitiesUpdate={updateCities}
      />

      <SettingsModal
        isOpen={activeModal === "settings"}
        onClose={() => setActiveModal(null)}
        bgGradient={bgGradient}
      />
    </div>
  );
}
