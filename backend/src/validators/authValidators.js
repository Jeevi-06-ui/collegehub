import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(1, "Password is required")
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough()
});
