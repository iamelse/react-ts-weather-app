import React from "react";
import { formatTempDisplay } from "../../utils";
import { getWeatherInfo } from "../../utils/weather";

interface HourlyItemProps {
  data: {
    time: string;
    temp: number;
    humidity: number;
    icon?: string;
    code?: number;
    is_day?: 0 | 1; // 0 = night, 1 = day
  };
  index: number;
  points: string;
  itemWidth: number;
  chartHeight: number;
}

const HourlyItem = React.memo(function HourlyItem({
  data,
  index,
  points,
  itemWidth,
  chartHeight,
}: HourlyItemProps) {
  // Hitung posisi y dari points
  const [, y] = points.split(" ")[index].split(",");

  const weatherInfo = getWeatherInfo(data.code, data.is_day ?? 1);

  return (
    <div style={{ width: itemWidth }} className="flex flex-col items-center">
      <span className="text-[0.65rem] text-white/70 mb-2 drop-shadow-xs">
        {data.time}
      </span>

      {/* Gunakan ikon dari weatherInfo + will-change */}
      <img
        src={`/icons/meteocons/${weatherInfo.icon}`}
        alt="weather"
        className="w-10 h-10 opacity-90 drop-shadow-xs will-change-icon"
        draggable={false}
      />

      <span className="text-base mt-1 drop-shadow-xs">
        {formatTempDisplay(data.temp)}°
      </span>

      <svg width={itemWidth} height={chartHeight} className="-mt-1">
        <polyline
          fill="none"
          stroke="white"
          strokeOpacity="0.6"
          strokeWidth="2"
          points={points
            .split(" ")
            .map((p) => {
              const [px, py] = p.split(",");
              return `${parseFloat(px) - index * itemWidth},${py}`;
            })
            .join(" ")}
        />
        <circle
          cx={itemWidth / 2}
          cy={y}
          r="3"
          fill="white"
          opacity="0.9"
        />
      </svg>

      <span className="text-[0.6rem] text-white/60 mt-1 drop-shadow-xs">
        {data.humidity}%
      </span>
    </div>
  );
});

export default HourlyItem;