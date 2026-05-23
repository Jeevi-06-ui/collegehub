"use client";

import { ArrowRight, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CollegeCard } from "@/components/colleges/college-card";
import { CollegeGridSkeleton } from "@/components/colleges/college-card-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { useColleges } from "@/hooks/use-colleges";
import { getApiErrorMessage } from "@/lib/api-client";

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const featuredQuery = useColleges({ sortBy: "rating", sortOrder: "desc", limit: 6, page: 1 });

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    router.push(`/colleges${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div>
      <section className="border-b bg-slate-50">
        <div className="container grid gap-8 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-1 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              API-powered college discovery
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-normal text-slate-950 md:text-5xl">
              CollegeHub
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Search, compare, and save colleges with real backend filtering, placement metrics, course data, and secure accounts.
            </p>
            <form onSubmit={handleSearch} className="mt-7 flex max-w-2xl flex-col gap-3 rounded-lg border bg-white p-2 shadow-soft sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by college, city, or course"
                  className="border-0 pl-9 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit">
                Search
                <ArrowRight />
              </Button>
            </form>
          </div>

          <div className="grid gap-3 rounded-lg border bg-white p-4 shadow-soft">
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Colleges" value={featuredQuery.data?.pagination.total ?? "--"} />
              <Metric label="Cities" value={featuredQuery.data?.filters.locations.length ?? "--"} />
              <Metric label="Courses" value={featuredQuery.data?.filters.courses.length ?? "--"} />
            </div>
            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-semibold">Featured locations</p>
              <p className="mt-1">
                {featuredQuery.data?.filters.locations.slice(0, 3).join(", ") || "Loading from API"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Top rated colleges</h2>
            <p className="mt-1 text-sm text-slate-600">Sorted by rating from the API.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/colleges">
              View all
              <ArrowRight />
            </Link>
          </Button>
        </div>

        {featuredQuery.isLoading ? <CollegeGridSkeleton /> : null}
        {featuredQuery.isError ? <ErrorState message={getApiErrorMessage(featuredQuery.error)} onRetry={() => featuredQuery.refetch()} /> : null}
        {featuredQuery.data && featuredQuery.data.data.length === 0 ? (
          <EmptyState title="No colleges found" description="Seed the database or adjust the API connection to load colleges." />
        ) : null}
        {featuredQuery.data?.data.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featuredQuery.data.data.map((college) => (
              <CollegeCard key={college._id} college={college} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-2xl font-bold text-slate-950">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}
