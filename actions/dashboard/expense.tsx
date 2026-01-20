"use server";

import { ACTION_ERRORS } from "@/lib/constants/constants";
import { ActionResult } from "@/lib/actions/types";
import { db } from "@/lib/db";
import { expenseInputSchema } from "@/lib/schema/expense-schema";
import { getSession } from "@/lib/auth/session";
import z from "zod";

export async function createExpense(
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await getSession();

  if (!session) {
    return {
      ok: false,
      type: ACTION_ERRORS.AUTH,
      message: "You are not authorized to perform this operation.",
    };
  }

  const input = {
    amount: Number(formData.get("amount")),
    currency: formData.get("currency"),
    category: formData.get("category"),
    paymentMode: formData.get("paymentMode"),
    description: formData.get("description"),
    satisfactionRating: Number(formData.get("satisfactionRating")),
    expenseDate: formData.get("expenseDate"),
  };

  const parsedInput = expenseInputSchema.safeParse(input);

  if (!parsedInput.success) {
    const fieldErrors = z.flattenError(parsedInput.error).fieldErrors;

    return {
      ok: false,
      type: ACTION_ERRORS.VALIDATION,
      errors: Object.fromEntries(
        Object.entries(fieldErrors)
          .filter(([, v]) => v?.length)
          .map(([k, v]) => [k, v![0]])
      ),
    };
  }

  const {
    amount,
    expenseDate,
    category,
    currency,
    paymentMode,
    description,
    satisfactionRating,
  } = parsedInput.data;

  await db.query(
    `
    INSERT INTO expenses (
    user_id,
    amount,
    expense_date,
    category,
    currency,
    payment_mode,
    description,
    satisfaction_rating
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      session?.userId,
      amount,
      expenseDate,
      category,
      currency,
      paymentMode,
      description,
      satisfactionRating,
    ]
  );

  return { ok: true };
}
