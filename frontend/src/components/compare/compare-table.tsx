"use client";

import { Bookmark, IndianRupee, MapPin, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatLocation, formatPackage } from "@/lib/format";
import type { CollegeSummary, ComparisonResponse } from "@/lib/types";

type CompareTableProps = {
  colleges: CollegeSummary[];
  comparison?: ComparisonResponse;
  isLoading: boolean;
  onSave: () => void;
  canSave: boolean;
  isSaving: boolean;
};

export function CompareTable({ colleges, comparison, isLoading, onSave, canSave, isSaving }: CompareTableProps) {
  if (colleges.length < 2) {
    return (
      <div className="rounded-lg border border-dashed bg-slate-50 p-8 text-center">
        <ScaleIcon />
        <h2 className="mt-4 text-lg font-semibold text-slate-950">Select 2 to 3 colleges</h2>
        <p className="mt-2 text-sm text-slate-600">Comparison details will appear here after selection.</p>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  const rows = [
    {
      label: "Location",
      icon: MapPin,
      values: comparison?.data.map((college) => formatLocation(college.location)) || []
    },
    {
      label: "Fees",
      icon: IndianRupee,
      values: comparison?.data.map((college) => formatCurrency(college.fees)) || []
    },
    {
      label: "Rating",
      icon: Star,
      values: comparison?.data.map((college) => `${college.rating.toFixed(1)}/5`) || []
    },
    {
      label: "Average package",
      icon: TrendingUp,
      values: comparison?.data.map((college) => formatPackage(college.placements.averagePackage)) || []
    },
    {
      label: "Highest package",
      icon: TrendingUp,
      values: comparison?.data.map((college) => formatPackage(college.placements.highestPackage)) || []
    },
    {
      label: "Courses",
      icon: Bookmark,
      values: comparison?.data.map((college) => college.courses.map((course) => course.name).join(", ")) || []
    }
  ];

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Comparison</h2>
          <p className="text-sm text-slate-600">{colleges.length} colleges selected</p>
        </div>
        <Button onClick={onSave} disabled={!canSave || isSaving}>
          <Bookmark />
          Save comparison
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-48 border-b bg-slate-50 p-4 text-left font-semibold text-slate-700">Metric</th>
              {comparison?.data.map((college) => (
                <th key={college._id} className="border-b bg-slate-50 p-4 text-left align-top">
                  <div className="flex items-center gap-3">
                    <span className="relative h-16 w-24 overflow-hidden rounded-md bg-slate-100">
                      <Image src={college.image} alt={college.name} fill sizes="96px" className="object-cover" />
                    </span>
                    <span className="font-semibold text-slate-950">{college.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <tr key={row.label}>
                  <td className="border-b p-4 font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-blue-600" />
                      {row.label}
                    </span>
                  </td>
                  {row.values.map((value, index) => (
                    <td key={`${row.label}-${index}`} className="border-b p-4 text-slate-700">
                      {value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScaleIcon() {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-blue-600">
      <TrendingUp className="h-5 w-5" />
    </div>
  );
}
