import React from "react";
import { formatTempDisplay } from "../../utils";

interface WeeklyItemProps {
  data: {
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation: number;
    icon?: string;
    text?: string;
  };
}

const WeeklyItem = React.memo(function WeeklyItem({ data }: WeeklyItemProps) {
  const dayName = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
      <span className="text-xs sm:text-sm font-medium text-white/80 w-16 sm:w-20 drop-shadow-xs truncate">
        {dayName}
      </span>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <span className="text-[11px] sm:text-xs text-white/40 w-5 sm:w-6 text-right tabular-nums">
          {Math.round(data.precipitation)}%
        </span>

        <span className="text-xs sm:text-sm text-white/60 w-[54px] sm:w-16 text-right tabular-nums">
          {formatTempDisplay(data.temp_min)}° / {formatTempDisplay(data.temp_max)}°
        </span>

        <img
          src={`/icons/meteocons/${data.icon ?? "clear-day.svg"}`}
          alt={data.text ?? "weather"}
          className="w-6 h-6 sm:w-7 sm:h-7 opacity-85 drop-shadow-xs"
          draggable={false}
        />
      </div>
    </div>
  );
});

export default WeeklyItem;
