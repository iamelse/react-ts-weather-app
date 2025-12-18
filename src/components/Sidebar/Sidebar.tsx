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
  bgGradient: { from: string; to: string };
}

export default function Sidebar({
  menuOpen,
  cities,
  selectedCity,
  onSelectCity,
  onOpenModal,
  bgGradient,
}: SidebarProps) {
  const favoriteCity = useMemo(() => cities.find((c) => c.is_favorite), [cities]);
  const { cities: weatherCities, loading, error } = useCityWeather(cities);

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-72 z-40 border-r border-white/10 transition-transform duration-500 ease-out ${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        background: menuOpen
          ? `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to}), rgba(0,0,0,0.5)`
          : "transparent",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Scrollable content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex justify-end mb-4">
            <Settings className="w-5 h-5 text-white/80" />
          </div>

          {favoriteCity && (
            <FavoriteLocation favoriteCity={favoriteCity} onSelectCity={onSelectCity} />
          )}

          <div className="flex items-center gap-2 my-4">
            <LocateIcon className="w-5 h-5 text-white" />
            <span className="text-sm text-white/90">Other Locations</span>
          </div>

          {loading && <p className="text-white/70 text-sm">Loading...</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <CityList cities={weatherCities} selectedCity={selectedCity} onSelectCity={onSelectCity} />
        </div>

        {/* Actions tetap di bawah */}
        <LocationActions onOpenModal={onOpenModal} />
      </div>
    </aside>
  );
}