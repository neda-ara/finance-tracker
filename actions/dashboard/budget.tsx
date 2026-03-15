"use server";

import {
  ActionResult,
  BaseFetchRequest,
  Budget,
  BudgetSummary,
  PaginatedResult,
  TotalByCurrency,
} from "@/lib/actions/types";
import { budgetInputSchema } from "@/lib/schema/budget-schema";
import { db } from "@/lib/db";
import { getAuthenticatedSession, safeRunAction } from "@/lib/actions/helpers";

export async function fetchBudgets(
  params: BaseFetchRequest,
): Promise<ActionResult<PaginatedResult<Budget>>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const pageNo = Math.max(1, params.page ?? 1);
    const pageSize = params.pageSize ?? 25;
    const offset = (pageNo - 1) * pageSize;

    const budgetList = await db.query<
      Budget & { spent: number; totalCount: number }
    >(
      `
      SELECT
        b.id,
        b.amount::float AS amount,
        b.currency,
        b.category,
        b.created_at AS "createdAt",
        COALESCE(SUM(e.amount)::float, 0) AS spent,
        COUNT(*) OVER()::int AS "totalCount"
      FROM budgets b
      LEFT JOIN expenses e
        ON e.user_id = b.user_id
       AND e.category = b.category
       AND e.expense_date >= date_trunc('month', CURRENT_DATE)
      WHERE b.user_id = $1
      GROUP BY b.id
      ORDER BY b.created_at
      LIMIT $2
      OFFSET $3
      `,
      [session?.userId, pageSize, offset],
    );

    const totalRecords = Number(budgetList.rows[0]?.totalCount ?? 0);

    return {
      data: budgetList.rows,
      pageNo,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  });
}

export async function fetchBudgetSummary(): Promise<
  ActionResult<BudgetSummary>
> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();
    const userId = session.userId;

    const totalBudget = await db.query<TotalByCurrency>(
      `
      SELECT currency, SUM(amount)::float AS total
      FROM budgets
      WHERE user_id = $1
      GROUP BY currency
      LIMIT 1
      `,
      [userId],
    );

    const spent = await db.query<TotalByCurrency>(
      `
      SELECT b.currency, SUM(e.amount)::float AS total
      FROM expenses e
      JOIN budgets b
        ON b.user_id = e.user_id
       AND b.category = e.category
      WHERE e.user_id = $1
        AND e.expense_date >= date_trunc('month', CURRENT_DATE)
      GROUP BY b.currency
      LIMIT 1
      `,
      [userId],
    );

    const budget = totalBudget.rows[0]?.total ?? 0;
    const spentAmount = spent.rows[0]?.total ?? 0;

    return {
      total: totalBudget.rows[0] && {
        currency: totalBudget.rows[0].currency,
        amount: budget,
      },
      spent: spent.rows[0] && {
        currency: spent.rows[0].currency,
        amount: spentAmount,
      },
      remaining: totalBudget.rows[0] && {
        currency: totalBudget.rows[0].currency,
        amount: budget - spentAmount,
      },
    };
  });
}

export async function createBudget(
  formData: FormData,
): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const input = {
      amount: Number(formData.get("amount")),
      currency: formData.get("currency"),
      category: formData.get("category"),
    };

    const parsedInput = budgetInputSchema.safeParse(input);

    if (!parsedInput.success) {
      throw {
        fieldErrors: Object.fromEntries(
          Object.entries(parsedInput.error.flatten().fieldErrors)
            .filter(([, v]) => v?.length)
            .map(([k, v]) => [k, v![0]]),
        ),
      };
    }

    const values = parsedInput.data;

    await db.query(
      `
      INSERT INTO budgets (
      user_id,
      amount,
      category,
      currency
      )
      VALUES ($1, $2, $3, $4)
    `,
      [session?.userId, values.amount, values.category, values.currency],
    );
  });
}

export async function updateBudget(
  formData: FormData,
): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const budgetId = formData.get("id");

    if (!budgetId) {
      throw { message: "Budget ID is missing" };
    }

    const input = {
      amount: Number(formData.get("amount")),
      currency: formData.get("currency"),
      category: formData.get("category"),
    };

    const parsedInput = budgetInputSchema.safeParse(input);

    if (!parsedInput.success) {
      throw {
        fieldErrors: Object.fromEntries(
          Object.entries(parsedInput.error.flatten().fieldErrors)
            .filter(([, v]) => v?.length)
            .map(([k, v]) => [k, v![0]]),
        ),
      };
    }

    const values = parsedInput.data;

    const result = await db.query(
      `
    UPDATE budgets
    SET
      amount = $1,
      category = $2,
      currency = $3
    WHERE id = $4 AND user_id = $5
    `,
      [
        values.amount,
        values.category,
        values.currency,
        budgetId,
        session?.userId,
      ],
    );

    if (result.rowCount === 0) {
      throw { message: "Requested budget not found" };
    }
  });
}

export async function deleteBudget(
  budgetId: string,
): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    if (!budgetId) {
      throw { message: "Budget ID is missing" };
    }

    const result = await db.query(
      `
      DELETE FROM budgets
      WHERE id = $1 AND user_id = $2
      `,
      [budgetId, session?.userId],
    );

    if (result.rowCount === 0) {
      throw { message: "Requested budget not found" };
    }
  });
}
