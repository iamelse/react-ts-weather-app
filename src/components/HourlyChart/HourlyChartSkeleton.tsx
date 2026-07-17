import Skeleton from "../Skeleton/Skeleton";

const ITEMS = 8;

export default function HourlyChartSkeleton() {
  return (
    <div className="w-full max-w-md bg-white/10 px-2 sm:px-3 py-2.5 sm:py-3 mt-4 sm:mt-5 rounded-2xl backdrop-blur-lg border border-white/10">
      <div className="flex gap-1 sm:gap-3 overflow-hidden">
        {Array.from({ length: ITEMS }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 sm:gap-1.5 min-w-[48px] sm:min-w-[52px]">
            <Skeleton className="h-3 w-6 sm:w-8 rounded" />
            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl" />
            <Skeleton className="h-3 sm:h-4 w-5 sm:w-7 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
