import type { City } from "../../types/city";
import { getWeatherInfo } from "../../utils/weather";
import { useFavoriteWeather } from "../../hooks/useFavoriteWeather";
import { useSettings } from "../../hooks/useSettings";
import FavoriteLocationSkeleton from "./FavoriteLocationSkeleton";

interface FavoriteLocationProps {
  favoriteCity: City;
  onSelectCity: (city: City) => void;
}

export default function FavoriteLocation({
  favoriteCity,
  onSelectCity,
}: FavoriteLocationProps) {
  const { unit } = useSettings();
  const { weather, loading } = useFavoriteWeather(favoriteCity);

  if (loading) return <FavoriteLocationSkeleton />;

  const unitSymbol = unit === "fahrenheit" ? "°F" : "°C";
  const weatherInfo =
    weather?.code !== undefined
      ? getWeatherInfo(weather.code, weather.is_day ?? 1)
      : null;

  return (
    <div
      onClick={() => onSelectCity(favoriteCity)}
      className="group flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition mb-3"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-yellow-400/80 font-medium">
            ★ Favorite
          </span>
        </div>
        <p className="text-sm text-white/90 truncate mt-0.5">
          {favoriteCity.name}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {weatherInfo && (
          <img
            src={`/icons/meteocons/${weatherInfo.icon}`}
            alt={weatherInfo.text}
            className="w-7 h-7 opacity-90"
            draggable={false}
          />
        )}
        <span className="text-sm font-semibold text-white/90 tabular-nums">
          {weather?.temp !== undefined
            ? Math.round(weather.temp) + unitSymbol
            : "--"}
        </span>
      </div>
    </div>
  );
}
