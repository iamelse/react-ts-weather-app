import { Star, Info } from "lucide-react";
import type { City } from "../../types/city";
import { getWeatherInfo } from "../../utils/weather";
import { useFavoriteWeather } from "../../hooks/useFavoriteWeather";

interface FavoriteLocationProps {
  favoriteCity: City;
  onSelectCity: (city: City) => void;
}

export default function FavoriteLocation({
  favoriteCity,
  onSelectCity,
}: FavoriteLocationProps) {
  const { weather, loading } = useFavoriteWeather(favoriteCity);

  // Pakai is_day langsung dari API, tanpa konversi boolean
  const weatherInfo =
    weather?.code !== undefined && weather.is_day !== undefined
      ? getWeatherInfo(weather.code, weather.is_day) // 1 = day, 0 = night
      : null;

  // console.log("FavoriteLocation weatherInfo:", weatherInfo);
  // console.log("FavoriteLocation weather:", weather);

  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Star strokeWidth={1} className="w-5 h-5 text-white" />
          <span className="text-white/90 text-sm">Favorite Location</span>
        </div>
        <button className="p-1 rounded hover:bg-white/20">
          <Info strokeWidth={1} className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Favorite city row */}
      <div
        onClick={() => onSelectCity(favoriteCity)}
        className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white/20 cursor-pointer"
      >
        {/* City name */}
        <span className="text-white/90 text-sm ms-5 truncate flex-1">
          {favoriteCity.name}
        </span>

        {/* Temp + icon */}
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