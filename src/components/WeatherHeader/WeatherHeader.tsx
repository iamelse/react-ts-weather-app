import { MapPin } from "lucide-react";
import { formatTempDisplay } from "../../utils";
import type { City, WeatherState } from "../../types/weather";
import { useFormattedDate } from "../../hooks/useFormattedDate";

interface WeatherHeaderProps {
  weather: WeatherState;
  selectedCity: City;
}

export default function WeatherHeader({ weather, selectedCity }: WeatherHeaderProps) {
  const formattedDate = useFormattedDate();
  const IconComponent = weather.current_icon;

  return (
    <div className="w-full max-w-md mt-16">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-6xl font-light">
            {formatTempDisplay(weather.temp)}°
          </h1>

          <p className="flex items-center gap-1 text-base mt-3">
            {selectedCity.name}
            <MapPin strokeWidth={1} className="w-4 h-4 text-white" />
          </p>

          <div className="my-5">
            <p className="text-white/90 text-base">
              {formatTempDisplay(weather.weekly[0]?.temp_max)}° /{" "}
              {formatTempDisplay(weather.weekly[0]?.temp_min)}° • feels{" "}
              {formatTempDisplay(weather.feels_like)}°
            </p>

            <p className="text-white/70 mt-1 text-sm">
              {formattedDate}
            </p>

            <p className="text-white/70 mt-1 text-sm">
              {weather.current_text}
            </p>
          </div>
        </div>

        <div className="flex items-center opacity-90">
          {IconComponent && (
            <IconComponent strokeWidth={1} className="w-20 h-20" />
          )}
        </div>
      </div>
    </div>
  );
}