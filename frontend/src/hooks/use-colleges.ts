"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { collegeApi } from "@/lib/api";
import type { CollegeQuery } from "@/lib/types";

export const useColleges = (params: CollegeQuery) =>
  useQuery({
    queryKey: ["colleges", params],
    queryFn: () => collegeApi.getColleges(params),
    placeholderData: keepPreviousData
  });

export const useCollege = (id: string) =>
  useQuery({
    queryKey: ["college", id],
    queryFn: () => collegeApi.getCollege(id),
    enabled: Boolean(id)
  });

export const useCollegeSearch = (q: string, limit = 8) =>
  useQuery({
    queryKey: ["college-search", q, limit],
    queryFn: () => collegeApi.searchColleges(q, limit),
    enabled: q.trim().length > 0,
    staleTime: 30_000
  });
