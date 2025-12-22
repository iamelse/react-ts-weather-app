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

// Pakai React.memo agar tidak re-render kecuali props berubah
const WeeklyItem = React.memo(function WeeklyItem({ data }: WeeklyItemProps) {
  const dayName = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="flex justify-between items-center py-0">
      {/* Nama hari */}
      <span className="font-light w-24 text-white/90 drop-shadow-xs">
        {dayName}
      </span>

      {/* Suhu dan Icon */}
      <div className="flex items-center gap-2 w-32 justify-end">
        <span className="font-light drop-shadow-xs">
          {formatTempDisplay(data.temp_min)}°{" "}
          {formatTempDisplay(data.temp_max)}°
        </span>

        <img
          src={`/icons/meteocons/${data.icon ?? "day.svg"}`}
          alt={data.text ?? "weather"}
          className="w-9 h-9 opacity-90 drop-shadow-xs will-change-icon"
          draggable={false}
        />
      </div>
    </div>
  );
});

export default WeeklyItem;