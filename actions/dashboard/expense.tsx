"use server";

import {
  ActionResult,
  Expense,
  ExpenseSummary,
  GetExpensesRequest,
  PaginatedResult,
} from "@/lib/actions/types";
import { db } from "@/lib/db";
import { expenseInputSchema } from "@/lib/schema/expense-schema";
import { getAuthenticatedSession, safeRunAction } from "@/lib/actions/helpers";

export async function fetchExpenses(
  params: GetExpensesRequest
): Promise<ActionResult<PaginatedResult<Expense, ExpenseSummary>>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const pageNo = Math.max(1, params.page ?? 1);
    const pageSize = params.pageSize ?? 25;
    const offset = (pageNo - 1) * pageSize;

    const expenseList = await db.query<Expense>(
      `SELECT
        id,
        amount::float AS amount,
        currency,
        category,
        payment_mode AS "paymentMode",
        description,
        satisfaction_rating AS "satisfactionRating",
        expense_date AS "expenseDate",
        created_at AS "createdAt"
      FROM expenses
      WHERE user_id = $1
      ORDER BY expense_date DESC, created_at DESC
      LIMIT $2 OFFSET $3
    `,
      [session?.userId, pageSize, offset]
    );

    const countRes = await db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM expenses WHERE user_id = $1`,
      [session?.userId]
    );

    const totalRecords = Number(countRes.rows[0].count);

    const thisMonth = await db.query<{ currency: string; total: number }>(
      `SELECT currency, SUM(amount)::float AS total
      FROM expenses
      WHERE user_id = $1
        AND expense_date >= date_trunc('month', CURRENT_DATE)
      GROUP BY currency
      ORDER BY total DESC
      LIMIT 1
      `,
      [session?.userId]
    );

    const last30Days = await db.query<{ currency: string; total: number }>(
      `SELECT currency, SUM(amount)::float AS total
      FROM expenses
      WHERE user_id = $1
        AND expense_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY currency
      ORDER BY total DESC
      LIMIT 1
      `,
      [session?.userId]
    );

    return {
      data: expenseList.rows,
      pageNo,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      summary: {
        spentThisMonth: thisMonth.rows[0] && {
          currency: thisMonth.rows[0].currency,
          amount: thisMonth.rows[0].total,
        },
        spentLast30Days: last30Days.rows[0] && {
          currency: last30Days.rows[0].currency,
          amount: last30Days.rows[0].total,
        },
      },
    };
  });
}

export async function createExpense(
  formData: FormData
): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

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
      throw {
        fieldErrors: Object.fromEntries(
          Object.entries(parsedInput.error.flatten().fieldErrors)
            .filter(([, v]) => v?.length)
            .map(([k, v]) => [k, v![0]])
        ),
      };
    }

    const values = parsedInput.data;

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
        values.amount,
        values.expenseDate,
        values.category,
        values.currency,
        values.paymentMode,
        values.description,
        values.satisfactionRating,
      ]
    );
  });
}

export async function updateExpense(
  formData: FormData
): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const expenseId = formData.get("id");

    if (!expenseId) {
      throw { message: "Expense ID is missing" };
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
      throw {
        fieldErrors: Object.fromEntries(
          Object.entries(parsedInput.error.flatten().fieldErrors)
            .filter(([, v]) => v?.length)
            .map(([k, v]) => [k, v![0]])
        ),
      };
    }

    const values = parsedInput.data;

    const result = await db.query(
      `
    UPDATE expenses
    SET
      amount = $1,
      expense_date = $2,
      category = $3,
      currency = $4,
      payment_mode = $5,
      description = $6,
      satisfaction_rating = $7
    WHERE id = $8 AND user_id = $9
    `,
      [
        values.amount,
        values.expenseDate,
        values.category,
        values.currency,
        values.paymentMode,
        values.description,
        values.satisfactionRating,
        expenseId,
        session?.userId,
      ]
    );

    if (result.rowCount === 0) {
      throw { message: "Requested expense not found" };
    }
  });
}

export async function deleteExpense(
  expenseId: string
): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    if (!expenseId) {
      throw { message: "Expense ID is missing" };
    }

    const result = await db.query(
      `
      DELETE FROM expenses
      WHERE id = $1 AND user_id = $2
      `,
      [expenseId, session?.userId]
    );

    if (result.rowCount === 0) {
      throw { message: "Requested expense not found" };
    }
  });
}
