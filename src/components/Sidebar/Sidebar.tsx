import { useEffect, useState } from "react";
import { LocateIcon, Settings } from "lucide-react";
import CityList from "./CityList";
import FavoriteLocation from "./FavoriteLocation";
import LocationActions from "./LocationActions";
import type { City } from "../../types/weather";
import { fetchCityWeather } from "../../api/weather";

interface SidebarProps {
  menuOpen: boolean;
  selectedCity: City;
  handleSelect: (city: City) => void;
}

const initialCities: City[] = [
  { name: "Banyumas", country: "Indonesia", latitude: -7.4375, longitude: 109.2386 },
  { name: "Cimahi", country: "Indonesia", latitude: -6.8975, longitude: 107.5746 },
  { name: "Bandung", country: "Indonesia", latitude: -6.9147, longitude: 107.6098 },
  { name: "Bogor", country: "Indonesia", latitude: -6.595, longitude: 106.8166 },
  { name: "Depok", country: "Indonesia", latitude: -6.4025, longitude: 106.7949 },
];

export default function Sidebar({
  menuOpen,
  selectedCity,
  handleSelect,
}: SidebarProps) {
  const [cities, setCities] = useState<City[]>(initialCities);

  useEffect(() => {
    Promise.all(initialCities.map(fetchCityWeather)).then(setCities);
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-72 z-30
      bg-white/10 backdrop-blur-xl border-r border-white/10
      transition-all duration-500 ease-out
      ${menuOpen ? "translate-x-0 opacity-100 scale-100" : "-translate-x-full opacity-0 scale-95"}`}
    >
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-end mb-4">
            <button className="p-2 rounded-lg hover:bg-white/20 transition">
              <Settings strokeWidth={1} className="w-5 h-5 text-white" />
            </button>
          </div>

          <FavoriteLocation
            selectedCity={selectedCity}
            onSelectCity={handleSelect}
          />

          <div className="flex items-center gap-2 mb-4 mt-6">
            <LocateIcon strokeWidth={1} className="w-5 h-5 text-white" />
            <span className="text-white/90 text-sm">Other Locations</span>
          </div>

          <CityList cities={cities} handleSelect={handleSelect} />
        </div>

        <LocationActions />
      </div>
    </aside>
  );
}