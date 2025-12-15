import { Star, Info } from "lucide-react";
import type { City } from "../../types/weather";
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

  const iconData = weather
    ? getWeatherInfo(weather.code)
    : { icon: Star, text: "" };

  const Icon = iconData.icon;

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Star strokeWidth={1} className="w-5 h-5 text-white" />
          <span className="text-white/90 text-sm">Favorite Location</span>
        </div>
        <button className="p-1 rounded hover:bg-white/20">
          <Info strokeWidth={1} className="w-5 h-5 text-white" />
        </button>
      </div>

      <div
        onClick={() => onSelectCity(favoriteCity)}
        className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white/20 cursor-pointer"
      >
        <span className="text-white/90 text-sm ms-5">
          {favoriteCity.name}
        </span>

        <div className="flex items-center gap-1">
          <span className="text-white/90 text-sm">
            {loading ? "..." : weather?.temp ?? "--"}°
          </span>
          <div className="w-5 h-5">
            {Icon && <Icon strokeWidth={1} className="w-5 h-5 text-white" />}
          </div>
        </div>
      </div>

      <hr className="border-white/20 my-2" />
    </div>
  );
}