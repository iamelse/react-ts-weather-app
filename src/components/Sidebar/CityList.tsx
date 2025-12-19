import type { City } from "../../types/city";
import { getWeatherInfo } from "../../utils/weather";

interface CityListProps {
  cities: City[];
  selectedCity?: City;
  onSelectCity: (city: City) => void;
}

export default function CityList({
  cities,
  selectedCity,
  onSelectCity,
}: CityListProps) {
  return (
    <div className="flex flex-col ms-5 gap-2 mb-4 overflow-y-auto max-h-full">
      {cities.map((city) => {
        // Pakai langsung is_day dari API (0 = night, 1 = day)
        const weatherInfo =
          city.current_code !== undefined && city.is_day !== undefined
            ? getWeatherInfo(city.current_code, city.is_day)
            : null;

        const isSelected =
          selectedCity?.latitude === city.latitude &&
          selectedCity?.longitude === city.longitude;

        return (
          <div
            key={`${city.latitude}-${city.longitude}`}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition
              ${isSelected ? "bg-white/25" : "hover:bg-white/20"}
            `}
            onClick={() => onSelectCity(city)}
          >
            {/* City name */}
            <span className="text-white/90 font-light text-sm truncate max-w-[150px]">
              {city.name}
            </span>

            {/* Icon + Temperature */}
            <div className="grid grid-cols-[auto_auto] items-center gap-1.5">
              {weatherInfo && (
                <img
                  src={`/icons/meteocons/${weatherInfo.icon}`}
                  alt={weatherInfo.text}
                  className="w-7 h-7 opacity-90"
                  draggable={false}
                />
              )}

              <span className="text-white/90 text-sm leading-none">
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