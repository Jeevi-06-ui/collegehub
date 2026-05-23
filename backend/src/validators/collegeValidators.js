import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB id");

export const collegeListSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
  query: z
    .object({
      search: z.string().trim().optional(),
      q: z.string().trim().optional(),
      location: z.string().trim().optional(),
      minFees: z.coerce.number().min(0).optional(),
      maxFees: z.coerce.number().min(0).optional(),
      rating: z.coerce.number().min(0).max(5).optional(),
      course: z.string().trim().optional(),
      sortBy: z.enum(["rating", "fees", "placements", "createdAt"]).optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(50).optional()
    })
    .passthrough()
});

export const collegeIdSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: objectId
  })
});

export const collegeSearchSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
  query: z.object({
    q: z.string().trim().optional(),
    limit: z.coerce.number().int().min(1).max(20).optional()
  })
});

export const compareSchema = z.object({
  body: z.object({
    collegeIds: z.array(objectId).min(2, "Select at least 2 colleges").max(3, "You can compare up to 3 colleges")
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const saveCollegeSchema = z.object({
  body: z.object({
    collegeId: objectId
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const saveComparisonSchema = z.object({
  body: z.object({
    title: z.string().trim().max(80).optional(),
    collegeIds: z.array(objectId).min(2).max(3)
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});
