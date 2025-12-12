import HourlyItem from "./HourlyItem";

interface HourlyChartProps {
  hourly: any[];
}

export default function HourlyChart({ hourly }: HourlyChartProps) {
  const itemWidth = 55;
  const chartHeight = 40;
  const paddingTop = 15;
  const paddingBottom = 10;

  const temps = hourly.map(h => h.temp);
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const effectiveHeight = chartHeight - paddingTop - paddingBottom;

  const points = temps
    .map((t, i) => {
      const x = i * itemWidth + itemWidth / 2;
      const y = paddingTop + effectiveHeight - ((t - minT) / (maxT - minT)) * effectiveHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full max-w-md bg-white/10 p-4 mt-8 rounded-2xl backdrop-blur-lg border border-white/10">
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-0">
          {hourly.map((h, idx) => (
            <HourlyItem key={idx} data={h} index={idx} points={points} itemWidth={itemWidth} chartHeight={chartHeight} />
          ))}
        </div>
      </div>
    </div>
  );
}