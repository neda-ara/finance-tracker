"use server";

import {
  ActionResult,
  CategoryBreakdown,
  ExpenseTrend,
  OverviewData,
} from "@/lib/actions/types";
import { db } from "@/lib/db";
import { getAuthenticatedSession, safeRunAction } from "@/lib/actions/helpers";

export async function fetchOverview(): Promise<ActionResult<OverviewData>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();
    const userId = session.userId;

    const earningsLastMonth = await db.query(
      `
      SELECT currency, SUM(amount)::float AS amount
      FROM earnings
      WHERE user_id = $1
        AND received_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
        AND received_date < date_trunc('month', CURRENT_DATE)
      GROUP BY currency
      LIMIT 1
      `,
      [userId],
    );

    const earningsPrevMonth = await db.query(
      `
      SELECT SUM(amount)::float AS amount
      FROM earnings
      WHERE user_id = $1
        AND received_date >= date_trunc('month', CURRENT_DATE - INTERVAL '2 month')
        AND received_date < date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
      `,
      [userId],
    );

    const expensesThisMonth = await db.query(
      `
      SELECT currency, SUM(amount)::float AS amount
      FROM expenses
      WHERE user_id = $1
        AND expense_date >= date_trunc('month', CURRENT_DATE)
      GROUP BY currency
      LIMIT 1
      `,
      [userId],
    );

    const expensesPrevMonth = await db.query(
      `
      SELECT SUM(amount)::float AS amount
      FROM expenses
      WHERE user_id = $1
        AND expense_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
        AND expense_date < date_trunc('month', CURRENT_DATE)
      `,
      [userId],
    );

    const budgetSummary = await db.query(
      `
      SELECT 
        b.currency,
        SUM(b.amount)::float AS total,
        COALESCE(SUM(e.amount), 0)::float AS spent
      FROM budgets b
      LEFT JOIN expenses e
        ON e.user_id = b.user_id
       AND e.category = b.category
       AND e.expense_date >= date_trunc('month', CURRENT_DATE)
      WHERE b.user_id = $1
      GROUP BY b.currency
      LIMIT 1
      `,
      [userId],
    );

    const overBudgetResult = await db.query(
      `
      SELECT COUNT(*)::int AS count
      FROM (
        SELECT b.category
        FROM budgets b
        JOIN expenses e
          ON e.user_id = b.user_id
         AND e.category = b.category
        WHERE b.user_id = $1
          AND e.expense_date >= date_trunc('month', CURRENT_DATE)
        GROUP BY b.category, b.amount
        HAVING SUM(e.amount) > b.amount
      ) t
      `,
      [userId],
    );

    const earningsAmount = earningsLastMonth.rows[0]?.amount ?? 0;
    const earningsPrev = earningsPrevMonth.rows[0]?.amount ?? 0;

    const expensesAmount = expensesThisMonth.rows[0]?.amount ?? 0;
    const expensesPrev = expensesPrevMonth.rows[0]?.amount ?? 0;

    const budgetRow = budgetSummary.rows[0];

    const earningsChange =
      earningsPrev === 0
        ? 0
        : ((earningsAmount - earningsPrev) / earningsPrev) * 100;

    const expensesChange =
      expensesPrev === 0
        ? 0
        : ((expensesAmount - expensesPrev) / expensesPrev) * 100;

    const netSavings = earningsAmount - expensesAmount;

    return {
      earningsLastMonth: {
        currency: earningsLastMonth.rows[0]?.currency,
        amount: earningsAmount,
        change: earningsChange,
      },
      expensesThisMonth: {
        currency: expensesThisMonth.rows[0]?.currency,
        amount: expensesAmount,
        change: expensesChange,
      },
      netSavings: {
        currency:
          earningsLastMonth.rows[0]?.currency ??
          expensesThisMonth.rows[0]?.currency,
        amount: netSavings,
      },
      budgetUsage: budgetRow && {
        currency: budgetRow.currency,
        total: budgetRow.total,
        spent: budgetRow.spent,
        remaining: budgetRow.total - budgetRow.spent,
      },
      overBudgetCount: overBudgetResult.rows[0]?.count ?? 0,
    };
  });
}

export async function fetchExpenseTrend(
  days: number,
): Promise<ActionResult<ExpenseTrend[]>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const trend = await db.query<ExpenseTrend>(
      `
      SELECT 
        expense_date::date AS date,
        SUM(amount)::float AS amount
      FROM expenses
      WHERE user_id = $1
        AND expense_date >= CURRENT_DATE - ($2 || ' days')::interval
      GROUP BY expense_date
      ORDER BY expense_date
      `,
      [session.userId, days],
    );

    return trend.rows;
  });
}

export async function fetchCategoryBreakdown(
  days: number,
): Promise<ActionResult<CategoryBreakdown[]>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const result = await db.query<CategoryBreakdown>(
      `
      SELECT 
        e.category,
        SUM(e.amount)::float AS amount,
        e.currency,
        b.amount::float AS budget
      FROM expenses e
      LEFT JOIN budgets b
        ON b.user_id = e.user_id
       AND b.category = e.category
      WHERE e.user_id = $1
        AND e.expense_date >= CURRENT_DATE - ($2 || ' days')::interval
      GROUP BY e.category, e.currency, b.amount
      ORDER BY amount DESC
      `,
      [session.userId, days],
    );

    return result.rows;
  });
}
