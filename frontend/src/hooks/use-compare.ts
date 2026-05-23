"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { compareApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-client";

export const useComparison = (collegeIds: string[]) =>
  useQuery({
    queryKey: ["comparison", collegeIds],
    queryFn: () => compareApi.compare(collegeIds),
    enabled: collegeIds.length >= 2,
    retry: false
  });

export const useSaveComparison = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: compareApi.saveComparison,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Comparison saved");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });
};

export const useToggleSavedCollege = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: compareApi.toggleSaveCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });
};
