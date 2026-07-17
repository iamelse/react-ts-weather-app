import React from "react";
import { formatTempDisplay } from "../../utils";
import { getWeatherInfo } from "../../utils/weather";

interface HourlyItemProps {
  data: {
    time: string;
    temp: number;
    icon?: string;
    code?: number;
    is_day?: 0 | 1;
    precip_prob?: number;
  };
  index: number;
}

const HourlyItem = React.memo(function HourlyItem({
  data,
  index,
}: HourlyItemProps) {
  const weatherInfo = getWeatherInfo(data.code, data.is_day ?? 1);
  const isNow = index === 0;

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5 min-w-[48px] sm:min-w-[52px]">
      <span className={`text-[11px] sm:text-xs font-medium ${isNow ? "text-white" : "text-white/70"}`}>
        {isNow ? "Now" : data.time}
      </span>

      <img
        src={`/icons/meteocons/${weatherInfo.icon}`}
        alt="weather"
        className="w-7 h-7 sm:w-8 sm:h-8 opacity-90 drop-shadow-xs"
        draggable={false}
      />

      <span className="text-xs sm:text-sm font-semibold drop-shadow-xs">
        {formatTempDisplay(data.temp)}°
      </span>

      {data.precip_prob !== undefined && data.precip_prob > 0 && (
        <span className="text-[10px] text-cyan-300/80 font-medium -mt-0.5">
          {data.precip_prob}%
        </span>
      )}
    </div>
  );
});

export default HourlyItem;
