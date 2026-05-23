"use client";

import { Scale } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CollegeSearchPicker } from "@/components/compare/college-search-picker";
import { CompareTable } from "@/components/compare/compare-table";
import { useAuth } from "@/components/providers/auth-provider";
import { ErrorState } from "@/components/ui/error-state";
import { useCollege } from "@/hooks/use-colleges";
import { useComparison, useSaveComparison } from "@/hooks/use-compare";
import { getApiErrorMessage } from "@/lib/api-client";
import type { CollegeSummary } from "@/lib/types";

export function CompareClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCollegeId = searchParams.get("college") || "";
  const initialCollegeQuery = useCollege(initialCollegeId);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CollegeSummary[]>([]);
  const { isAuthenticated } = useAuth();
  const comparisonQuery = useComparison(selected.map((college) => college._id));
  const saveComparison = useSaveComparison();

  useEffect(() => {
    const college = initialCollegeQuery.data?.college;
    if (!college) return;

    setSelected((current) => {
      if (current.some((item) => item._id === college._id) || current.length >= 3) {
        return current;
      }

      return [...current, college];
    });
  }, [initialCollegeQuery.data]);

  const addCollege = (college: CollegeSummary) => {
    setSelected((current) => {
      if (current.some((item) => item._id === college._id) || current.length >= 3) {
        return current;
      }
      return [...current, college];
    });
    setQuery("");
  };

  const save = async () => {
    if (!isAuthenticated) {
      toast.error("Login to save comparisons");
      router.push("/login?next=/compare");
      return;
    }

    await saveComparison.mutateAsync({
      collegeIds: selected.map((college) => college._id),
      title: selected.map((college) => college.name).join(" vs ")
    });
  };

  return (
    <div className="container-page">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-600">
          <Scale className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Compare colleges</h1>
          <p className="mt-1 text-slate-600">Compare fees, ratings, placements, location, and courses side by side.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <CollegeSearchPicker
          query={query}
          selected={selected}
          onQueryChange={setQuery}
          onAdd={addCollege}
          onRemove={(id) => setSelected((current) => current.filter((college) => college._id !== id))}
        />

        <div className="space-y-4">
          {comparisonQuery.isError ? <ErrorState message={getApiErrorMessage(comparisonQuery.error)} /> : null}
          <CompareTable
            colleges={selected}
            comparison={comparisonQuery.data}
            isLoading={comparisonQuery.isLoading}
            onSave={save}
            canSave={selected.length >= 2}
            isSaving={saveComparison.isPending}
          />
        </div>
      </div>
    </div>
  );
}
