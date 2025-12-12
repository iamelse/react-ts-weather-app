import { Sunrise, Sunset } from "lucide-react";

interface SunInfoProps {
  sunrise: string;
  sunset: string;
}

export default function SunInfo({ sunrise, sunset }: SunInfoProps) {
  return (
    <div className="w-full max-w-md bg-white/10 p-6 mt-6 rounded-2xl backdrop-blur-lg border border-white/10 grid grid-cols-2 gap-6 text-center">
      <div className="flex flex-col items-center">
        <span className="text-white/80 text-sm">Sunrise</span>
        <span className="text-xl font-light mt-1">{sunrise}</span>
        <Sunrise strokeWidth={1} className="w-14 h-14 opacity-90 mt-3" />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white/80 text-sm">Sunset</span>
        <span className="text-xl font-light mt-1">{sunset}</span>
        <Sunset strokeWidth={1} className="w-14 h-14 opacity-90 mt-3" />
      </div>
    </div>
  );
}