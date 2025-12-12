import { Sun, CloudDrizzle, CloudRain } from "lucide-react";

interface ExtraInfoProps {
  uv_index: number;
  humidity: number;
  wind_speed: number;
}

export default function ExtraInfo({ uv_index, humidity, wind_speed }: ExtraInfoProps) {
  return (
    <div className="w-full max-w-md bg-white/10 p-6 mt-6 rounded-2xl backdrop-blur-lg border border-white/10 grid grid-cols-3 text-center gap-6">
      <div className="flex flex-col items-center">
        <Sun strokeWidth={1} className="w-12 h-12 opacity-90 mb-2" />
        <span className="text-white/70 text-xs tracking-wide">UV Index</span>
        <span className="text-lg font-light mt-1">{uv_index}</span>
      </div>
      <div className="flex flex-col items-center">
        <CloudDrizzle strokeWidth={1} className="w-12 h-12 opacity-90 mb-2" />
        <span className="text-white/70 text-xs tracking-wide">Humidity</span>
        <span className="text-lg font-light mt-1">{humidity}%</span>
      </div>
      <div className="flex flex-col items-center">
        <CloudRain strokeWidth={1} className="w-12 h-12 opacity-90 mb-2" />
        <span className="text-white/70 text-xs tracking-wide">Wind</span>
        <span className="text-lg font-light mt-1">{wind_speed} km/h</span>
      </div>
    </div>
  );
}