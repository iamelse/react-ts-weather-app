import { formatTempDisplay } from "../../utils";

interface HourlyItemProps {
  data: {
    time: string;
    temp: number;
    humidity: number;
    icon?: string;
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

  return (
    <div style={{ width: itemWidth }} className="flex flex-col items-center">
      <span className="text-[0.65rem] text-white/70 mb-2 drop-shadow-xs">
        {data.time}
      </span>

      <img
        src={`/icons/animated/${data.icon ?? "day"}.svg`}
        alt="weather"
        className="w-9 h-9 opacity-90 drop-shadow-xs"
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