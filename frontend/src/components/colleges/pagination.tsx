"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pagination as PaginationType } from "@/lib/types";

type PaginationProps = {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
};

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (pagination.pages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-lg border bg-white p-3 text-sm text-slate-600 sm:flex-row">
      <p>
        Page <span className="font-semibold text-slate-950">{pagination.page}</span> of{" "}
        <span className="font-semibold text-slate-950">{pagination.pages}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pagination.page >= pagination.pages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
