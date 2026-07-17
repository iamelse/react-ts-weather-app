import { ChevronDown, ChevronUp } from "lucide-react";
import WeeklyItem from "./WeeklyItem";

interface WeeklyForecastProps {
  weekly: {
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation: number;
    icon?: string;
    text?: string;
  }[];
  onToggleDays?: () => void;
  forecastDays?: number;
}

const INITIAL_SHOW = 7;

export default function WeeklyForecast({
  weekly,
  onToggleDays,
  forecastDays = 7,
}: WeeklyForecastProps) {
  if (!weekly || weekly.length === 0) return null;

  const showAll = forecastDays > INITIAL_SHOW;
  const displayWeekly = showAll ? weekly : weekly.slice(0, INITIAL_SHOW);

  return (
    <div className="w-full max-w-md bg-white/10 px-3 sm:px-4 py-3 mt-4 sm:mt-5 rounded-2xl backdrop-blur-lg border border-white/10">
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
          {showAll ? "16-Day Forecast" : "7-Day Forecast"}
        </span>
        {onToggleDays && weekly.length > INITIAL_SHOW && (
          <button
            onClick={onToggleDays}
            className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white/80 transition"
          >
            {showAll ? "Show less" : "Show 16 days"}
            {showAll ? (
              <ChevronUp className="w-3 h-3" strokeWidth={2} />
            ) : (
              <ChevronDown className="w-3 h-3" strokeWidth={2} />
            )}
          </button>
        )}
      </div>
      <div className="space-y-1">
        {displayWeekly.map((w) => (
          <WeeklyItem key={w.date} data={w} />
        ))}
      </div>
    </div>
  );
}
