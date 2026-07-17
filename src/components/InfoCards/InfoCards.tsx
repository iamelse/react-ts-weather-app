import { Sun, Droplets, Wind, Sunrise, Sunset, Navigation } from "lucide-react";
import type { WeatherState } from "../../types/weather";

function uvLabel(index: number): string {
  if (index <= 2) return "Low";
  if (index <= 5) return "Moderate";
  if (index <= 7) return "High";
  if (index <= 10) return "Very High";
  return "Extreme";
}

function aqiLabelColor(aqi: number): string {
  if (aqi <= 20) return "text-green-400";
  if (aqi <= 40) return "text-yellow-400";
  if (aqi <= 60) return "text-orange-400";
  if (aqi <= 80) return "text-red-400";
  if (aqi <= 100) return "text-purple-400";
  return "text-red-600";
}

function aqiLabel(aqi: number): string {
  if (aqi <= 20) return "Good";
  if (aqi <= 40) return "Fair";
  if (aqi <= 60) return "Moderate";
  if (aqi <= 80) return "Poor";
  if (aqi <= 100) return "Very Poor";
  return "Extremely Poor";
}

function windDirectionLabel(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

interface InfoCardsProps {
  weather: WeatherState;
}

export default function InfoCards({ weather }: InfoCardsProps) {
  return (
    <div className="w-full max-w-md mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-2.5">
      <div className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-lg border border-white/10">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" strokeWidth={1.5} />
          <span className="text-[10px] sm:text-[11px] font-medium text-white/60 uppercase tracking-wide">
            UV Index
          </span>
        </div>
        <span className="text-xl sm:text-2xl font-semibold drop-shadow-xs">{weather.uv_index}</span>
        <span className="text-[10px] sm:text-[11px] text-white/50 ml-1 sm:ml-1.5">{uvLabel(weather.uv_index)}</span>
      </div>

      <div className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-lg border border-white/10">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" strokeWidth={1.5} />
          <span className="text-[10px] sm:text-[11px] font-medium text-white/60 uppercase tracking-wide">
            Humidity
          </span>
        </div>
        <span className="text-xl sm:text-2xl font-semibold drop-shadow-xs">{weather.humidity}</span>
        <span className="text-[10px] sm:text-[11px] text-white/50 ml-1 sm:ml-1.5">%</span>
      </div>

      <div className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-lg border border-white/10">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" strokeWidth={1.5} />
          <span className="text-[10px] sm:text-[11px] font-medium text-white/60 uppercase tracking-wide">
            Wind
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-semibold drop-shadow-xs">{Math.round(weather.wind_speed)}</span>
          <span className="text-[10px] sm:text-[11px] text-white/50">km/h</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Navigation
            className="w-3 h-3 text-white/50"
            strokeWidth={2}
            style={{ transform: `rotate(${weather.wind_direction}deg)` }}
          />
          <span className="text-[11px] sm:text-xs text-white/50">
            {windDirectionLabel(weather.wind_direction)}
          </span>
        </div>
      </div>

      <div className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-lg border border-white/10">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <Sunrise className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" strokeWidth={1.5} />
          <span className="text-[10px] sm:text-[11px] font-medium text-white/60 uppercase tracking-wide">
            Sunrise
          </span>
        </div>
        <span className="text-base sm:text-lg font-semibold drop-shadow-xs">{weather.sunrise}</span>
        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
          <Sunset className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/50" strokeWidth={1.5} />
          <span className="text-[11px] sm:text-xs text-white/60">{weather.sunset}</span>
        </div>
      </div>

      {weather.aqi && (
        <div className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-lg border border-white/10 col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                <span className="text-[10px] sm:text-[11px] font-medium text-white/60 uppercase tracking-wide">
                  Air Quality
                </span>
              </div>
              <span className={`text-xl sm:text-2xl font-semibold drop-shadow-xs ${aqiLabelColor(weather.aqi.aqi)}`}>
                {weather.aqi.aqi}
              </span>
              <span className={`text-[10px] sm:text-[11px] ml-1.5 ${aqiLabelColor(weather.aqi.aqi)}`}>
                {aqiLabel(weather.aqi.aqi)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-white/40">PM2.5</div>
              <div className="text-sm font-medium text-white/70">{weather.aqi.pm2_5.toFixed(1)}</div>
              <div className="text-[11px] text-white/40 mt-0.5">PM10</div>
              <div className="text-sm font-medium text-white/70">{weather.aqi.pm10.toFixed(1)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
