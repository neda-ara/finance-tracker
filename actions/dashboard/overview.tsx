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
        AND earning_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
        AND earning_date < date_trunc('month', CURRENT_DATE)
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
        AND earning_date >= date_trunc('month', CURRENT_DATE - INTERVAL '2 month')
        AND earning_date < date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
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

    const topExpenses = await db.query(
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
        AND e.expense_date >= date_trunc('month', CURRENT_DATE)
      GROUP BY e.category, e.currency, b.amount
      ORDER BY amount DESC
      LIMIT 5
      `,
      [userId],
    );

    const earningsAmount = earningsLastMonth.rows[0]?.amount ?? 0;
    const earningsPrev = earningsPrevMonth.rows[0]?.amount ?? 0;

    const expensesAmount = expensesThisMonth.rows[0]?.amount ?? 0;
    const expensesPrev = expensesPrevMonth.rows[0]?.amount ?? 0;

    const earningsChange =
      earningsPrev === 0
        ? 0
        : ((earningsAmount - earningsPrev) / earningsPrev) * 100;

    const expensesChange =
      expensesPrev === 0
        ? 0
        : ((expensesAmount - expensesPrev) / expensesPrev) * 100;

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
      topExpenses: topExpenses.rows,
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
