"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { CollegeFilters, CollegeQuery } from "@/lib/types";

type FilterSidebarProps = {
  filters: CollegeQuery;
  options?: CollegeFilters;
  onChange: (filters: CollegeQuery) => void;
  onReset: () => void;
};

export function FilterSidebar({ filters, options, onChange, onReset }: FilterSidebarProps) {
  const update = (patch: Partial<CollegeQuery>) => onChange({ ...filters, ...patch, page: 1 });

  return (
    <aside className="rounded-lg border bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-slate-950">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          Filters
        </h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X />
          Reset
        </Button>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select id="location" value={filters.location || "all"} onChange={(event) => update({ location: event.target.value })}>
            <option value="all">All locations</option>
            {options?.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Select id="course" value={filters.course || "all"} onChange={(event) => update({ course: event.target.value })}>
            <option value="all">All courses</option>
            {options?.courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="minFees">Min fees</Label>
            <Input
              id="minFees"
              type="number"
              min={0}
              value={filters.minFees ?? ""}
              onChange={(event) => update({ minFees: event.target.value ? Number(event.target.value) : "" })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxFees">Max fees</Label>
            <Input
              id="maxFees"
              type="number"
              min={0}
              value={filters.maxFees ?? ""}
              onChange={(event) => update({ maxFees: event.target.value ? Number(event.target.value) : "" })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Minimum rating</Label>
          <Select
            id="rating"
            value={filters.rating ? String(filters.rating) : ""}
            onChange={(event) => update({ rating: event.target.value ? Number(event.target.value) : "" })}
          >
            <option value="">Any rating</option>
            <option value="4.5">4.5+</option>
            <option value="4">4.0+</option>
            <option value="3.5">3.5+</option>
          </Select>
        </div>
      </div>
    </aside>
  );
}
