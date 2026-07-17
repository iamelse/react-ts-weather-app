import Skeleton from "../Skeleton/Skeleton";

const ROWS = 5;

export default function WeeklyForecastSkeleton() {
  return (
    <div className="w-full max-w-md bg-white/10 px-3 sm:px-4 py-3 mt-4 sm:mt-5 rounded-2xl backdrop-blur-lg border border-white/10 space-y-1">
      {Array.from({ length: ROWS }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Skeleton className="h-3 w-5 sm:w-6" />
            <Skeleton className="h-3 sm:h-4 w-[54px] sm:w-20" />
            <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
