import { Star, Info } from "lucide-react";
import type { City } from "../../types/city";
import { getWeatherInfo } from "../../utils/weather";
import { useFavoriteWeather } from "../../hooks/useFavoriteWeather";

interface FavoriteLocationProps {
  favoriteCity: City;
  onSelectCity: (city: City) => void;
  onOpenInfoModal: (city: City) => void;
}

export default function FavoriteLocation({
  favoriteCity,
  onSelectCity,
  onOpenInfoModal,
}: FavoriteLocationProps) {
  const { weather, loading } = useFavoriteWeather(favoriteCity);

  const weatherInfo =
    weather?.code !== undefined
      ? getWeatherInfo(weather.code, weather.is_day ? 1 : 0)
      : null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* HEADER */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1">
          <Star strokeWidth={1} className="w-5 h-5 text-white" />
          <span className="text-white/90 text-sm leading-5 ms-1">
            Favorite Location
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // jangan trigger row click
            onOpenInfoModal(favoriteCity);
          }}
          className="p-1 rounded hover:bg-white/20"
        >
          <Info strokeWidth={1} className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Favorite city row */}
      <div
        onClick={() => onSelectCity(favoriteCity)}
        className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white/20 cursor-pointer"
      >
        <span className="text-white/90 text-sm ms-5 truncate flex-1">
          {favoriteCity.name}
        </span>

        <div className="flex items-center gap-2 min-w-[72px] justify-end shrink-0">
          {weatherInfo && (
            <img
              src={`/icons/meteocons/${weatherInfo.icon}`}
              alt={weatherInfo.text}
              className="w-8 h-8 opacity-90"
              draggable={false}
            />
          )}

          <span className="text-white/90 text-sm leading-none whitespace-nowrap">
            {loading
              ? "..."
              : weather?.temp !== undefined
              ? Math.round(weather.temp) + "°"
              : "--°"}
          </span>
        </div>
      </div>

      <hr className="border-white/20 my-2" />
    </div>
  );
}