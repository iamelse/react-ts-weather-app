import React from "react";
import type { City } from "../../types/city";
import { getWeatherInfo } from "../../utils/weather";
import type { TempUnit } from "../../types/settings";

interface CityRowProps {
  city: City;
  isSelected: boolean;
  onSelectCity: (city: City) => void;
  unit: TempUnit;
}

const CityRow = React.memo(function CityRow({
  city,
  isSelected,
  onSelectCity,
  unit,
}: CityRowProps) {
  const weatherInfo =
    city.current_code !== undefined && city.is_day !== undefined
      ? getWeatherInfo(city.current_code, city.is_day)
      : null;

  const unitSymbol = unit === "fahrenheit" ? "°F" : "°C";

  return (
    <div
      className={`flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl cursor-pointer transition
        ${isSelected ? "bg-white/20" : "hover:bg-white/10"}
      `}
      onClick={() => onSelectCity(city)}
    >
      <span className="text-sm text-white/80 truncate flex-1 min-w-0 mr-2">
        {city.name}
      </span>

      <div className="flex items-center gap-1.5 shrink-0">
        {weatherInfo && (
          <img
            src={`/icons/meteocons/${weatherInfo.icon}`}
            alt={weatherInfo.text}
            className="w-6 h-6 opacity-80"
            draggable={false}
          />
        )}
        <span className="text-sm text-white/70 tabular-nums">
          {city.current_temp !== undefined
            ? Math.round(city.current_temp) + unitSymbol
            : "--"}
        </span>
      </div>
    </div>
  );
});

interface CityListProps {
  cities: City[];
  selectedCity?: City;
  onSelectCity: (city: City) => void;
  unit: TempUnit;
}

export default function CityList({
  cities,
  selectedCity,
  onSelectCity,
  unit,
}: CityListProps) {
  return (
    <div className="flex flex-col gap-0.5">
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
            unit={unit}
          />
        );
      })}
    </div>
  );
}
