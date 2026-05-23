"use client";

import { useMutation } from "@tanstack/react-query";
import { predictorApi } from "@/lib/api";

export const usePredictor = () =>
  useMutation({
    mutationFn: predictorApi.predict
  });
