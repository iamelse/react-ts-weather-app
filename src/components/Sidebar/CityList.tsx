import React from "react";
import type { City } from "../../types/city";
import { getWeatherInfo } from "../../utils/weather";
import { useSettings } from "../../context/SettingsContext";

interface CityListProps {
  cities: City[];
  selectedCity?: City;
  onSelectCity: (city: City) => void;
}

const CityRow = React.memo(
  ({
    city,
    isSelected,
    onSelectCity,
  }: {
    city: City;
    isSelected: boolean;
    onSelectCity: (city: City) => void;
  }) => {
    const { unit } = useSettings();

    const weatherInfo =
      city.current_code !== undefined && city.is_day !== undefined
        ? getWeatherInfo(city.current_code, city.is_day)
        : null;

    const unitSymbol = unit === "fahrenheit" ? "°F" : "°C";

    return (
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors
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
              ? Math.round(city.current_temp) + unitSymbol
              : "--"}
          </span>
        </div>
      </div>
    );
  }
);

export default function CityList({
  cities,
  selectedCity,
  onSelectCity,
}: CityListProps) {
  return (
    <div className="flex flex-col ms-5 gap-2 mb-4 overflow-y-auto max-h-full">
      {cities.map((city) => {
        const isSelected =
          selectedCity?.latitude === city.latitude &&
          selectedCity?.longitude === city.longitude;

        return (
          <CityRow
            key={`${city.latitude}-${city.longitude}`}
            city={city}
            isSelected={isSelected}
            onSelectCity={onSelectCity}
          />
        );
      })}
    </div>
  );
}