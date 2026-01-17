import { VALIDATION } from "../constants/constants";
import { z } from "zod";

export const expenseInputSchema = z.object({
  amount: z.union([
    z.coerce.number().min(0).max(VALIDATION.MAX_AMOUNT_LIMIT).multipleOf(0.01),
    z.literal(""),
  ]),
  currency: z
    .string()
    .trim()
    .min(3, "Currency code must be 3 chars")
    .max(3, "Currency code must be 3 chars"),
  expenseDate: z.date(),
  category: z.string().min(1, "Please choose a category"),
  description: z
    .string()
    .trim()
    .max(
      VALIDATION.MAX_DESCRIPTION_LENGTH,
      `Description cannot be more than ${VALIDATION.MAX_DESCRIPTION_LENGTH}`
    ),
  paymentMode: z.string().trim().min(1, "Please enter mode of payment"),
  satisfactionRating: z
    .int()
    .min(1, "Satisfaction rating cannot be less than 1")
    .max(5, "Satisfaction rating cannot be more than 5"),
});
