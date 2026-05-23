import { Skeleton } from "@/components/ui/skeleton";

export function CollegeCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-2">
        <Skeleton className="mt-3 h-5 w-3/4" />
        <Skeleton className="mt-3 h-4 w-1/2" />
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
        <Skeleton className="mt-5 h-10 w-full" />
      </div>
    </div>
  );
}

export function CollegeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <CollegeCardSkeleton key={index} />
      ))}
    </div>
  );
}
