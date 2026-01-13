import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().trim().min(1, "Please enter password"),
});
