"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { questionApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-client";

export const useQuestions = (params: { search?: string; page?: number; limit?: number }) =>
  useQuery({
    queryKey: ["questions", params],
    queryFn: () => questionApi.getQuestions(params),
    placeholderData: keepPreviousData
  });

export const useQuestion = (id: string) =>
  useQuery({
    queryKey: ["question", id],
    queryFn: () => questionApi.getQuestion(id),
    enabled: Boolean(id)
  });

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApi.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question posted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });
};

export const useAnswerQuestion = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApi.answerQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", id] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Answer posted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });
};
