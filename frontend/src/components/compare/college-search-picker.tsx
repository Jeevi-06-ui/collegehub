"use client";

import { Plus, Search, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollegeSearch } from "@/hooks/use-colleges";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatLocation } from "@/lib/format";
import type { CollegeSummary } from "@/lib/types";

type CollegeSearchPickerProps = {
  query: string;
  selected: CollegeSummary[];
  onQueryChange: (value: string) => void;
  onAdd: (college: CollegeSummary) => void;
  onRemove: (id: string) => void;
};

export function CollegeSearchPicker({
  query,
  selected,
  onQueryChange,
  onAdd,
  onRemove
}: CollegeSearchPickerProps) {
  const debouncedQuery = useDebouncedValue(query);
  const searchQuery = useCollegeSearch(debouncedQuery, 8);
  const canAddMore = selected.length < 3;
  const selectedIds = new Set(selected.map((college) => college._id));

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search colleges"
          className="pl-9"
          disabled={!canAddMore}
        />
      </div>

      {selected.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {selected.map((college) => (
            <span
              key={college._id}
              className="inline-flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              {college.name}
              <button type="button" onClick={() => onRemove(college._id)} className="text-slate-500 hover:text-slate-900">
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {query.trim() && canAddMore ? (
        <div className="mt-4 overflow-hidden rounded-lg border">
          {searchQuery.isLoading ? (
            <div className="space-y-2 p-3">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : (
            searchQuery.data?.data
              .filter((college) => !selectedIds.has(college._id))
              .map((college) => (
                <button
                  type="button"
                  key={college._id}
                  onClick={() => onAdd(college)}
                  className="flex w-full items-center justify-between gap-3 border-b p-3 text-left last:border-b-0 hover:bg-slate-50"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <Image src={college.image} alt={college.name} fill sizes="64px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-slate-950">{college.name}</span>
                      <span className="text-sm text-slate-600">{formatLocation(college.location)}</span>
                    </span>
                  </span>
                  <Plus className="h-4 w-4 text-blue-600" />
                </button>
              ))
          )}
        </div>
      ) : null}
    </div>
  );
}
