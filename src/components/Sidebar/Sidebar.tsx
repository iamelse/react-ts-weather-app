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
  { name: "Bogor", country: "Indonesia", latitude: -6.5950, longitude: 106.8166 },
  { name: "Depok", country: "Indonesia", latitude: -6.4025, longitude: 106.7949 },
  { name: "Bekasi", country: "Indonesia", latitude: -6.2376, longitude: 106.9924 },
  { name: "Karawang", country: "Indonesia", latitude: -6.3264, longitude: 107.3022 },
  { name: "Tasikmalaya", country: "Indonesia", latitude: -7.3271, longitude: 108.2221 },
  { name: "Garut", country: "Indonesia", latitude: -7.2169, longitude: 107.9062 },
  { name: "Majalengka", country: "Indonesia", latitude: -6.8370, longitude: 108.2096 },
  { name: "Sumedang", country: "Indonesia", latitude: -6.8413, longitude: 107.9200 },
];

export default function Sidebar({ menuOpen, selectedCity, handleSelect }: SidebarProps) {
  const [cities, setCities] = useState<City[]>(initialCities);

  useEffect(() => {
    Promise.all(initialCities.map(fetchCityWeather)).then((updatedCities) => {
      setCities(updatedCities);
    });
  }, []);

  return (
    <div
      className={`fixed left-0 top-0 h-full w-72 bg-white/10 backdrop-blur-xl p-4 border-r border-white/10 transition-transform duration-300 z-20
        flex flex-col justify-between
        ${menuOpen ? "translate-x-0" : "-translate-x-72"}`}
    >
      <div>
        <div className="flex justify-end mb-4">
          <button className="p-2 rounded-lg hover:bg-white/20">
            <Settings strokeWidth={1} className="w-5 h-5 text-white" />
          </button>
        </div>

        <FavoriteLocation selectedCity={selectedCity} onSelectCity={handleSelect} />

        <div className="flex items-center gap-2 mb-4">
          <LocateIcon strokeWidth={1} className="w-5 h-5 text-white" />
          <span className="text-white/90 font-light text-sm">Other Location</span>
        </div>

        <CityList cities={cities} handleSelect={handleSelect} />
      </div>

      <LocationActions />
    </div>
  );
}