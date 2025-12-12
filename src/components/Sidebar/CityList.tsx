import type { City } from "../../types/weather";
import { getWeatherIcon } from "../../utils/weather";

interface CityListProps {
  cities: City[];
  handleSelect: (city: City) => void;
}

export default function CityList({ cities, handleSelect }: CityListProps) {
  return (
    <div className="flex flex-col gap-2 mb-4 overflow-y-auto max-h-[50vh]">
      {cities.map((city) => {
        const IconComponent =
          city.current_code !== undefined ? getWeatherIcon(city.current_code).icon : null;

        return (
          <div
            key={city.name}
            className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/20 cursor-pointer transition"
            onClick={() => handleSelect(city)}
          >
            <span className="text-white/90 font-light text-sm truncate">{city.name}</span>
            <div className="flex items-center gap-1">
              {IconComponent ? <IconComponent strokeWidth={1} className="w-5 h-5 text-white" /> : null}
              <span className="text-white/90 font-light text-sm">
                {city.current_temp !== undefined ? Math.round(city.current_temp) + "°" : "--°"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}