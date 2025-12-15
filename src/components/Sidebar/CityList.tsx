import type { City } from "../../types/city";
import { getWeatherInfo } from "../../utils/weather";

interface CityListProps {
  cities: City[];
  selectedCity: City;
  handleSelect: (city: City) => void;
}

export default function CityList({
  cities,
  selectedCity,
  handleSelect,
}: CityListProps) {
  return (
    <div className="flex flex-col ms-5 gap-2 mb-4 overflow-y-auto max-h-[50vh]">
      {cities.map((city) => {
        const IconComponent =
          city.current_code !== undefined
            ? getWeatherInfo(city.current_code).icon
            : null;

        const isSelected =
          city.latitude === selectedCity.latitude &&
          city.longitude === selectedCity.longitude;

        return (
          <div
            key={`${city.latitude}-${city.longitude}`}
            className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition
              ${isSelected ? "bg-white/25" : "hover:bg-white/20"}
            `}
            onClick={() => handleSelect(city)}
          >
            <span className="text-white/90 font-light text-sm truncate">
              {city.name}
            </span>

            <div className="flex items-center gap-1">
              {IconComponent && (
                <IconComponent
                  strokeWidth={1}
                  className="w-5 h-5 text-white"
                />
              )}
              <span className="text-white/90 font-light text-sm">
                {city.current_temp !== undefined
                  ? Math.round(city.current_temp) + "°"
                  : "--°"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}