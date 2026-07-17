import Skeleton from "../Skeleton/Skeleton";

export default function InfoCardsSkeleton() {
  return (
    <div className="w-full max-w-md mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-2.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white/10 rounded-2xl p-3 sm:p-3.5 backdrop-blur-lg border border-white/10">
          <Skeleton className="h-3 w-14 sm:w-16 mb-1.5 sm:mb-2" />
          <Skeleton className="h-6 sm:h-7 w-10 sm:w-12" />
          <Skeleton className="h-3 w-6 sm:w-8 mt-0.5 sm:mt-1" />
        </div>
      ))}
    </div>
  );
}
