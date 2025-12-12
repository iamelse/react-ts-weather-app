import { formatTempDisplay } from "../../utils";

interface WeeklyItemProps {
  data: {
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation: number;
    icon?: any;
    text?: string;
  };
}

export default function WeeklyItem({ data }: WeeklyItemProps) {
  const dayName = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long", // hanya nama hari penuh
  });

  const Icon = data.icon;

  return (
    <div className="flex justify-between items-center py-0">
      {/* Nama hari */}
      <span className="font-light w-24 text-white/90">{dayName}</span>

      {/* Suhu dan Icon dalam satu kolom */}
      <div className="flex items-center gap-2 w-32 justify-end">
        <span className="font-light">
          {formatTempDisplay(data.temp_min)}° {formatTempDisplay(data.temp_max)}°
        </span>
        {Icon && <Icon strokeWidth={1} className="w-6 h-6 opacity-90" />}
      </div>
    </div>
  );
}