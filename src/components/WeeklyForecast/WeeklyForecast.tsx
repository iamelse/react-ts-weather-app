import WeeklyItem from "./WeeklyItem";

interface WeeklyForecastProps {
  weekly: {
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation: number;
    icon?: any;
    text?: string;
  }[];
}

export default function WeeklyForecast({ weekly }: WeeklyForecastProps) {
  if (!weekly || weekly.length === 0) return <p>No weekly data</p>;

  return (
    <div className="w-full max-w-md bg-white/10 p-6 mt-6 rounded-2xl backdrop-blur-lg border border-white/10 space-y-3">
      {weekly.map((w) => (
        <WeeklyItem key={w.date} data={w} />
      ))}
    </div>
  );
}