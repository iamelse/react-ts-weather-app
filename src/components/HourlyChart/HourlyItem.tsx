import { formatTempDisplay } from "../../utils";
import { getWeatherInfo } from "../../utils/weather";

interface HourlyItemProps {
  data: {
    time: string;
    temp: number;
    humidity: number;
    icon?: string;
    code?: number;
    is_day?: 0 | 1; // gunakan 0 = night, 1 = day
  };
  index: number;
  points: string;
  itemWidth: number;
  chartHeight: number;
}

export default function HourlyItem({
  data,
  index,
  points,
  itemWidth,
  chartHeight,
}: HourlyItemProps) {
  const [_, y] = points.split(" ")[index].split(",");

  // Pakai is_day dari API (0 = night, 1 = day)
  const weatherInfo = getWeatherInfo(data.code, data.is_day ?? 1);

  // console.log("HourlyItem data:", data);
  // console.log("HourlyItem weatherInfo:", weatherInfo);

  return (
    <div style={{ width: itemWidth }} className="flex flex-col items-center">
      <span className="text-[0.65rem] text-white/70 mb-2 drop-shadow-xs">
        {data.time}
      </span>

      {/* Gunakan icon dari weatherInfo */}
      <img
        src={`/icons/meteocons/${weatherInfo.icon}`}
        alt="weather"
        className="w-10 h-10 opacity-90 drop-shadow-xs"
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
}