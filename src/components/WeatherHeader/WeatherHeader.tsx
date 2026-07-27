import { MapPin, LocateFixed } from "lucide-react";
import { formatTempDisplay } from "../../utils";
import type { WeatherState } from "../../types/weather";
import type { City } from "../../types/city";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import WeatherIcon from "../WeatherIcon";
import { getWeatherInfo } from "../../utils/weather";
import { formatLocationName } from "../../utils/location";

interface WeatherHeaderProps {
  weather: WeatherState;
  selectedCity?: City;
  geoLocated?: boolean;
  geoDenied?: boolean;
  onUseMyLocation?: () => void;
}

export default function WeatherHeader({
  weather,
  selectedCity,
  geoLocated,
  geoDenied,
  onUseMyLocation,
}: WeatherHeaderProps) {
  const formattedDate = useFormattedDate();

  if (!selectedCity) {
    return (
      <div className="w-full max-w-md mt-16 text-white/70">
        Loading location...
      </div>
    );
  }

  const weatherInfo = getWeatherInfo(weather.current_code, weather.is_day ?? 1);

  return (
    <div className="w-full max-w-md">
      {/* Location */}
      <div className="flex items-center justify-center gap-1.5 text-white/60 text-xs sm:text-sm mb-1">
        <MapPin strokeWidth={1.5} className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
        <span className="truncate max-w-[160px] sm:max-w-[220px]">
          {formatLocationName(selectedCity.name)}
        </span>
        <button
          onClick={onUseMyLocation}
          className={`p-1 rounded-lg transition-colors ${
            geoDenied
              ? "text-red-400 hover:text-red-300"
              : geoLocated
                ? "text-sky-300 hover:text-sky-200"
                : "text-white/40 hover:text-white/70"
          }`}
          aria-label="Use my location"
          title={
            geoDenied
              ? "Location access denied — click to try again"
              : "Use my location"
          }
        >
          <LocateFixed strokeWidth={1.5} className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Date */}
      <p className="text-center text-[11px] sm:text-xs text-white/40 mb-3 sm:mb-4">
        {formattedDate}
      </p>

      {/* Temp + Icon */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <span className="text-7xl sm:text-8xl md:text-9xl font-thin tracking-tight drop-shadow-md leading-none">
          {formatTempDisplay(weather.temp)}°
        </span>
        <WeatherIcon
          name={weatherInfo.icon}
          alt={weatherInfo.text}
          size={72}
        />
      </div>

      {/* Condition text */}
      <p className="text-center text-sm sm:text-base font-medium text-white/85 mt-2 drop-shadow-xs">
        {weatherInfo.text}
      </p>

      {/* High/Low + Feels like */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-white/65 flex-wrap">
        {weather.weekly[0] && (
          <span className="whitespace-nowrap">
            H:{formatTempDisplay(weather.weekly[0].temp_max)}° L:{formatTempDisplay(weather.weekly[0].temp_min)}°
          </span>
        )}
        <span className="text-white/30">•</span>
        <span className="whitespace-nowrap">Feels like {formatTempDisplay(weather.feels_like)}°</span>
      </div>
    </div>
  );
}
