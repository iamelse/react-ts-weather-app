import { useMemo } from "react";
import { LocateIcon, Settings } from "lucide-react";

import CityList from "./CityList";
import FavoriteLocation from "./FavoriteLocation";
import LocationActions from "./LocationActions";

import type { City } from "../../types/city";
import { useCityWeather } from "../../hooks/useCityWeather";

interface SidebarProps {
  menuOpen: boolean;
  cities: City[];
  selectedCity?: City;
  onSelectCity: (city: City) => void;
  onOpenModal: () => void;
  onOpenSettingModal: () => void;
  onOpenInfoModal?: (city: City) => void;
  bgGradient: { from: string; to: string };
}

export default function Sidebar({
  menuOpen,
  cities,
  selectedCity,
  onSelectCity,
  onOpenModal,
  onOpenSettingModal,
  onOpenInfoModal,
  bgGradient,
}: SidebarProps) {
  const favoriteCity = useMemo(
    () => cities.find((c) => c.is_favorite),
    [cities]
  );

  const { cities: weatherCities, loading, error } = useCityWeather(cities);

  return (
    <aside
      className="fixed top-0 left-0 h-full w-72 z-40 border-r border-white/10"
      style={{
        transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-out",
        background: menuOpen
          ? `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to}), rgba(0,0,0,0.5)`
          : "transparent",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* SETTINGS BUTTON */}
          <div className="flex justify-end mb-6 mt-6 ms-10">
            <button
              onClick={onOpenSettingModal}
              className="p-1 rounded hover:bg-white/10 transition"
            >
              <Settings className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {favoriteCity && onOpenInfoModal && (
            <FavoriteLocation
              favoriteCity={favoriteCity}
              onSelectCity={onSelectCity}
              onOpenInfoModal={onOpenInfoModal}
            />
          )}

          <div className="flex items-center gap-2 my-4">
            <LocateIcon className="w-5 h-5 text-white" />
            <span className="text-sm text-white/90">Other Locations</span>
          </div>

          {loading && <p className="text-white/70 text-sm">Loading...</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <CityList
            cities={weatherCities}
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
          />
        </div>

        <LocationActions onOpenModal={onOpenModal} />
      </div>
    </aside>
  );
}