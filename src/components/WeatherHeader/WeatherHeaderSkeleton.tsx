import Skeleton from "../Skeleton/Skeleton";

export default function WeatherHeaderSkeleton() {
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center gap-1.5 mb-1">
        <Skeleton className="h-3 sm:h-4 w-32 sm:w-44" />
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1 sm:mt-2">
        <Skeleton className="h-14 sm:h-20 w-20 sm:w-28 rounded-xl" />
        <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl" />
      </div>

      <div className="flex justify-center mt-1 sm:mt-2">
        <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
      </div>

      <div className="flex justify-center mt-1 sm:mt-2">
        <Skeleton className="h-3 sm:h-4 w-40 sm:w-56" />
      </div>
    </div>
  );
}
