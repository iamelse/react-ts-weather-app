import Skeleton from "../Skeleton/Skeleton";

const ROWS = 4;

export default function CityListSkeleton() {
  return (
    <div className="flex flex-col gap-0.5">
      {Array.from({ length: ROWS }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl">
          <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 rounded-xl" />
            <Skeleton className="h-3 sm:h-4 w-8 sm:w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
