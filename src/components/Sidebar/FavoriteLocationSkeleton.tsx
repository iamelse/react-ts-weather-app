import Skeleton from "../Skeleton/Skeleton";

export default function FavoriteLocationSkeleton() {
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-white/10 mb-3">
      <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
        <Skeleton className="h-3 w-12 sm:w-14" />
        <Skeleton className="h-3 sm:h-4 w-28 sm:w-36" />
      </div>
      <div className="flex items-center gap-1 sm:gap-1.5">
        <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 rounded-xl" />
        <Skeleton className="h-3 sm:h-4 w-8 sm:w-10" />
      </div>
    </div>
  );
}
