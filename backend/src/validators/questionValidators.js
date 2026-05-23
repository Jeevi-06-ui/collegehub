import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB id");

export const questionListSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
  query: z
    .object({
      search: z.string().trim().optional(),
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(50).optional()
    })
    .passthrough()
});

export const createQuestionSchema = z.object({
  body: z.object({
    title: z.string().trim().min(8, "Title must be at least 8 characters").max(160),
    description: z.string().trim().min(20, "Description must be at least 20 characters").max(4000)
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const questionIdSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: objectId
  })
});

export const answerQuestionSchema = z.object({
  body: z.object({
    text: z.string().trim().min(3, "Answer must be at least 3 characters").max(2000)
  }),
  query: z.object({}).passthrough(),
  params: z.object({
    id: objectId
  })
});
