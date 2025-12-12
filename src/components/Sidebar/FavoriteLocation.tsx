import { useEffect, useState } from "react";
import { Star, Info } from "lucide-react";
import { getWeatherIcon } from "../../utils/weather";
import type { City } from "../../types/weather";

interface FavoriteLocationProps {
  selectedCity: City;
  onSelectCity: (city: City) => void;
}

interface WeatherInfo {
  temp: number;
  code: number;
}

export default function FavoriteLocation({ selectedCity, onSelectCity }: FavoriteLocationProps) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  // fetch weather saat selectedCity berubah
  useEffect(() => {
    if (!selectedCity) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current=temperature_2m,weather_code`
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
        });
      } catch (err) {
        console.error("Failed to fetch favorite location weather:", err);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  const iconData = weather ? getWeatherIcon(weather.code) : { icon: Star, text: "" };
  const Icon = iconData.icon;

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Star strokeWidth={1} className="w-5 h-5 text-white" />
          <span className="text-white/90 font-light text-sm">Favorite Location</span>
        </div>
        <button className="p-1 rounded hover:bg-white/20">
          <Info strokeWidth={1} className="w-5 h-5 text-white" />
        </button>
      </div>

      <div
        className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white/20 cursor-pointer"
        onClick={() => onSelectCity(selectedCity)}
      >
        <div className="flex items-center gap-2">
          <span className="text-white/90 font-light text-sm">{selectedCity.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/90 font-light text-sm">{weather ? `${weather.temp}°` : "--°"}</span>
          <div className="w-5 h-5">{Icon && <Icon strokeWidth={1} className="w-5 h-5 text-white" />}</div>
        </div>
      </div>

      <hr className="border-white/20 my-2" />
    </div>
  );
}