import { VALIDATION } from "../constants/constants";
import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const earningInputSchema = z.object({
  amount: z.union([
    z.coerce
      .number()
      .min(0.01, "Please enter a value more than 0")
      .max(
        VALIDATION.EXPENSE.MAX_AMOUNT_LIMIT,
        "Max amount limit of 9,999,999.99 exceeded",
      )
      .multipleOf(0.01),
    z.literal(""),
  ]),
  currency: z
    .string()
    .trim()
    .min(3, "Currency code must be 3 chars")
    .max(3, "Currency code must be 3 chars"),
  receivedDate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) {
      const d = new Date(val);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return val;
  }, z.date()),
  source: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Please enter category"),
  description: z
    .string()
    .trim()
    .max(VALIDATION.MAX_DESCRIPTION_LENGTH, {
      message: `Description cannot be more than ${VALIDATION.MAX_DESCRIPTION_LENGTH}`,
    })
    .optional()
    .or(z.literal("")),
});
