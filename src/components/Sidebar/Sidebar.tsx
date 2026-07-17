import { useMemo } from "react";
import { X, Settings, MapPin } from "lucide-react";

import CityList from "./CityList";
import CityListSkeleton from "./CityListSkeleton";
import FavoriteLocation from "./FavoriteLocation";
import LocationActions from "./LocationActions";

import type { City } from "../../types/city";
import { useCityWeather } from "../../hooks/useCityWeather";
import { useSettings } from "../../hooks/useSettings";

interface SidebarProps {
  menuOpen: boolean;
  cities: City[];
  selectedCity?: City;
  onSelectCity: (city: City) => void;
  onOpenModal: () => void;
  onOpenSettingModal: () => void;
  bgGradient: { from: string; to: string };
  onClose: () => void;
}

export default function Sidebar({
  menuOpen,
  cities,
  selectedCity,
  onSelectCity,
  onOpenModal,
  onOpenSettingModal,
  bgGradient,
  onClose,
}: SidebarProps) {
  const favoriteCity = useMemo(
    () => cities.find((c) => c.is_favorite),
    [cities]
  );

  const { unit } = useSettings();
  const { cities: weatherCities, loading, error } = useCityWeather(cities);

  return (
    <aside
      className="fixed top-0 left-0 h-full w-[85vw] max-w-72 z-40 flex flex-col"
      style={{
        transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-out",
        background: menuOpen
          ? `linear-gradient(to bottom, ${bgGradient.from}, ${bgGradient.to})`
          : "transparent",
      }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-2 text-white/70">
          <MapPin strokeWidth={1.5} className="w-4 h-4" />
          <span className="text-sm font-medium">Locations</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSettingModal}
            className="p-1.5 rounded-lg hover:bg-white/20 transition"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-white/70" strokeWidth={1.5} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 text-white/70" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto sidebar-scroll px-3 sm:px-4 pb-4">
          {favoriteCity && (
            <FavoriteLocation
              favoriteCity={favoriteCity}
              onSelectCity={onSelectCity}
            />
          )}

        <div className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2 mt-1">
          Saved Cities
        </div>

        {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

        {loading ? (
          <CityListSkeleton />
        ) : (
          <CityList
            cities={weatherCities}
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
            unit={unit}
          />
        )}
      </div>

      {/* Bottom action */}
      <div className="px-3 sm:px-4 pb-4 shrink-0">
        <LocationActions onOpenModal={onOpenModal} />
      </div>
    </aside>
  );
}
