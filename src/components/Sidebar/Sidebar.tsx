import { useMemo } from "react";
import { LocateIcon, Settings } from "lucide-react";

import CityList from "./CityList";
import FavoriteLocation from "./FavoriteLocation";
import LocationActions from "./LocationActions";

import type { City } from "../../types/weather";
import { useCityWeather } from "../../hooks/useCityWeather";

interface SidebarProps {
  menuOpen: boolean;
  cities: City[];
  selectedCity: City;
  handleSelect: (city: City) => void;
  onOpenModal: () => void;
}

export default function Sidebar({
  menuOpen,
  cities,
  selectedCity,
  handleSelect,
  onOpenModal,
}: SidebarProps) {
  const favoriteCity = useMemo(
    () => cities.find((c) => c.is_favorite),
    [cities]
  );

  const { cities: weatherCities, loading, error } =
    useCityWeather(cities);

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-72 z-30 bg-white/10 backdrop-blur-xl
      transition-all duration-500
      ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-end mb-4">
            <Settings className="w-5 h-5 text-white" />
          </div>

          {favoriteCity && (
            <FavoriteLocation
              favoriteCity={favoriteCity}
              onSelectCity={handleSelect}
            />
          )}

          <div className="flex items-center gap-2 my-4">
            <LocateIcon className="w-5 h-5 text-white" />
            <span className="text-sm">Other Locations</span>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}

          <CityList
            cities={weatherCities}
            selectedCity={selectedCity}
            handleSelect={handleSelect}
          />
        </div>

        <LocationActions onOpenModal={onOpenModal} />
      </div>
    </aside>
  );
}