import { VALIDATION } from "../constants/constants";
import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

const maxAmount = VALIDATION.EXPENSE.MAX_AMOUNT_LIMIT;

export const budgetInputSchema = z.object({
  amount: z.union([
    z.coerce
      .number()
      .min(0.01, "Please enter a value more than 0")
      .max(
        maxAmount,
        `Max amount limit of ${maxAmount.toLocaleString()} exceeded`,
      )
      .multipleOf(0.01),
    z.literal(""),
  ]),
  currency: z
    .string()
    .trim()
    .min(3, "Currency code must be 3 chars")
    .max(3, "Currency code must be 3 chars"),
  category: z.string().min(1, "Please choose category for budget"),
});
