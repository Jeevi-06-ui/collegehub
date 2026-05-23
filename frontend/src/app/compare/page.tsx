import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CompareClient } from "./compare-client";

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="container-page">
          <Skeleton className="h-[520px] rounded-lg" />
        </div>
      }
    >
      <CompareClient />
    </Suspense>
  );
}
