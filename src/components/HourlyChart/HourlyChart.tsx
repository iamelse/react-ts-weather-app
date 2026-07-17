import HourlyItem from "./HourlyItem";
import type { HourlyItem as HourlyItemType } from "../../types/weather";

interface HourlyChartProps {
  hourly: HourlyItemType[];
}

export default function HourlyChart({ hourly }: HourlyChartProps) {
  if (!hourly.length) return null;

  return (
    <div className="w-full max-w-md bg-white/10 px-2 sm:px-3 py-2.5 sm:py-3 mt-4 sm:mt-5 rounded-2xl backdrop-blur-lg border border-white/10">
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-0.5 sm:gap-1 px-0.5 sm:px-1">
          {hourly.map((h, idx) => (
            <HourlyItem key={idx} data={h} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
