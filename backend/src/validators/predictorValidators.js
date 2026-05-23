import { z } from "zod";

export const predictorSchema = z.object({
  body: z.object({
    exam: z.enum(["KCET", "COMEDK", "JEE"]),
    rank: z.coerce.number().int().min(1, "Rank must be at least 1")
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});
