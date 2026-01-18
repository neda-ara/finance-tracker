import { VALIDATION } from "../constants/constants";
import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const expenseInputSchema = z.object({
  amount: z.union([
    z.coerce
      .number()
      .min(0.01, "Please enter a value more than 0")
      .max(
        VALIDATION.MAX_AMOUNT_LIMIT,
        "Max amount limit of 9,999,999.99 exceeded"
      )
      .multipleOf(0.01),
    z.literal(""),
  ]),
  currency: z
    .string()
    .trim()
    .min(3, "Currency code must be 3 chars")
    .max(3, "Currency code must be 3 chars"),
  expenseDate: z.date().refine(
    (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d <= today;
    },
    { message: "Future dates are not allowed" }
  ),
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
