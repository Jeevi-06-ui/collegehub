"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { CollegeCard } from "@/components/colleges/college-card";
import { CollegeGridSkeleton } from "@/components/colleges/college-card-skeleton";
import { FilterSidebar } from "@/components/colleges/filter-sidebar";
import { Pagination } from "@/components/colleges/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useColleges } from "@/hooks/use-colleges";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/lib/api-client";
import type { CollegeQuery } from "@/lib/types";

const defaultFilters: CollegeQuery = {
  page: 1,
  limit: 12,
  sortBy: "rating",
  sortOrder: "desc"
};

function CollegesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [filters, setFilters] = useState<CollegeQuery>({ ...defaultFilters, search: initialSearch });
  const debouncedSearch = useDebouncedValue(filters.search || "");

  const queryParams = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch
    }),
    [debouncedSearch, filters]
  );

  const collegesQuery = useColleges(queryParams);
  const total = collegesQuery.data?.pagination.total ?? 0;

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [CollegeQuery["sortBy"], CollegeQuery["sortOrder"]];
    setFilters((current) => ({ ...current, sortBy, sortOrder, page: 1 }));
  };

  return (
    <div className="container-page">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Colleges</h1>
          <p className="mt-2 text-slate-600">{total ? `${total} colleges match your criteria` : "Browse colleges from the database"}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_220px] lg:w-[620px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={filters.search || ""}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))}
              placeholder="Search colleges, cities, courses"
              className="pl-9"
            />
          </div>
          <Select value={`${filters.sortBy}-${filters.sortOrder}`} onChange={(event) => handleSortChange(event.target.value)}>
            <option value="rating-desc">Rating high to low</option>
            <option value="fees-asc">Fees low to high</option>
            <option value="fees-desc">Fees high to low</option>
            <option value="placements-desc">Placements high to low</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          filters={filters}
          options={collegesQuery.data?.filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />

        <div className="space-y-5">
          {collegesQuery.isLoading ? <CollegeGridSkeleton count={9} /> : null}
          {collegesQuery.isError ? (
            <ErrorState message={getApiErrorMessage(collegesQuery.error)} onRetry={() => collegesQuery.refetch()} />
          ) : null}
          {collegesQuery.data && collegesQuery.data.data.length === 0 ? (
            <EmptyState title="No colleges found" description="Try changing your search, fees range, location, course, or rating filter." />
          ) : null}
          {collegesQuery.data?.data.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {collegesQuery.data.data.map((college) => (
                  <CollegeCard key={college._id} college={college} />
                ))}
              </div>
              <Pagination
                pagination={collegesQuery.data.pagination}
                onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="container-page"><CollegeGridSkeleton /></div>}>
      <CollegesContent />
    </Suspense>
  );
}
