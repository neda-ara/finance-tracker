"use server";

import {
  ActionResult,
  CategoryBreakdown,
  ExpenseTrend,
  Interval,
  OverviewData,
  TopExpensesData,
} from "@/lib/actions/types";
import { db } from "@/lib/db";
import { getAuthenticatedSession, safeRunAction } from "@/lib/actions/helpers";

export async function fetchOverview(): Promise<ActionResult<OverviewData>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();
    const userId = session.userId;

    const earningsCurrent = await db.query(
      `
      SELECT currency, SUM(amount)::float AS amount
      FROM earnings
      WHERE user_id = $1
        AND received_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY currency
      ORDER BY amount DESC
      LIMIT 1
      `,
      [userId],
    );

    const earningsPrev = await db.query(
      `
      SELECT SUM(amount)::float AS amount
      FROM earnings
      WHERE user_id = $1
        AND received_date >= CURRENT_DATE - INTERVAL '60 days'
        AND received_date < CURRENT_DATE - INTERVAL '30 days'
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
      ORDER BY amount DESC
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
    COALESCE(SUM(exp.spent), 0)::float AS spent
  FROM budgets b
  LEFT JOIN (
    SELECT category, SUM(amount)::float AS spent
    FROM expenses
    WHERE user_id = $1
      AND expense_date >= date_trunc('month', CURRENT_DATE)
    GROUP BY category
  ) exp
    ON exp.category = b.category
  WHERE b.user_id = $1
  GROUP BY b.currency
  ORDER BY total DESC
  LIMIT 1
  `,
      [userId],
    );

    const earningsAmount = earningsCurrent.rows[0]?.amount ?? 0;
    const earningsPrevAmount = earningsPrev.rows[0]?.amount ?? 0;

    const expensesAmount = expensesThisMonth.rows[0]?.amount ?? 0;
    const expensesPrevAmount = expensesPrevMonth.rows[0]?.amount ?? 0;

    const savingsAmount = earningsAmount - expensesAmount;
    const savingsPrev = earningsPrevAmount - expensesPrevAmount;

    const budgetRow = budgetSummary.rows[0];

    return {
      earnings: {
        currency: earningsCurrent.rows[0]?.currency,
        amount: earningsAmount,
        change: calcChange(earningsAmount, earningsPrevAmount),
      },
      expenses: {
        currency: expensesThisMonth.rows[0]?.currency,
        amount: expensesAmount,
        change: calcChange(expensesAmount, expensesPrevAmount),
      },
      savings: {
        currency:
          earningsCurrent.rows[0]?.currency ??
          expensesThisMonth.rows[0]?.currency,
        amount: savingsAmount,
        change: calcChange(savingsAmount, savingsPrev),
      },
      budget: budgetRow && {
        total: budgetRow.total ?? 0,
        spent: budgetRow.spent ?? 0,
        remaining: (budgetRow.total ?? 0) - (budgetRow.spent ?? 0),
        currency: budgetRow?.currency,
        usedPercentage:
          budgetRow.total === 0 ? 0 : (budgetRow.spent / budgetRow.total) * 100,
      },
    };
  });
}

export async function fetchTopExpenses(
  interval: Interval = "this_month",
): Promise<ActionResult<TopExpensesData>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();
    const userId = session.userId;

    const { condition, paramsBuilder } = getDateFilter(interval);
    const params = paramsBuilder(userId);

    const topExpenses = await db.query(
      `
      SELECT 
        e.category,
        e.currency,
        SUM(e.amount)::float AS amount,

        b.amount::float AS budget,

        COALESCE(
          (SUM(e.amount) / NULLIF(b.amount, 0)) * 100,
          NULL
        ) AS "budgetUsed",

        COALESCE(b.amount - SUM(e.amount), NULL) AS "remaining"

      FROM expenses e
      LEFT JOIN budgets b
        ON b.user_id = e.user_id
       AND b.category = e.category

      WHERE e.user_id = $1
        AND ${condition}

      GROUP BY e.category, e.currency, b.amount
      ORDER BY amount DESC
      LIMIT 5
      `,
      params,
    );

    const totalExpenses = await db.query(
      `
      SELECT 
        currency,
        SUM(amount)::float AS amount
      FROM expenses
      WHERE user_id = $1
        AND ${condition}
      GROUP BY currency
      LIMIT 1
      `,
      params,
    );

    const totalAmount = totalExpenses.rows[0]?.amount ?? 0;

    return {
      interval,
      total: {
        currency: totalExpenses.rows[0]?.currency,
        amount: totalAmount,
      },
      topCategories: topExpenses.rows.map((row) => ({
        ...row,
        percentage: row.budgetUsed ? parseFloat(row.budgetUsed) : 0,
      })),
    };
  });
}

export async function fetchExpenseTrend(
  interval: Interval,
): Promise<ActionResult<ExpenseTrend[]>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();
    const { condition, paramsBuilder } = getDateFilter(interval);

    const trend = await db.query<ExpenseTrend>(
      `
      SELECT 
        expense_date::date AS date,
        SUM(amount)::float AS amount
      FROM expenses
      WHERE user_id = $1
        AND ${condition}
      GROUP BY expense_date
      ORDER BY expense_date
      `,
      paramsBuilder(session.userId),
    );

    return trend.rows;
  });
}

export async function fetchCategoryBreakdown(
  interval: Interval,
): Promise<ActionResult<CategoryBreakdown[]>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();
    const { condition, paramsBuilder } = getDateFilter(interval);

    const result = await db.query<CategoryBreakdown>(
      `
      SELECT 
        e.category,
        e.currency,
        SUM(e.amount)::float AS amount,

        b.amount::float AS budget,

        COALESCE(
          (SUM(e.amount) / NULLIF(b.amount, 0)) * 100,
          NULL
        ) AS "budgetUsed",

        COALESCE(b.amount - SUM(e.amount), NULL) AS "remaining"

      FROM expenses e
      LEFT JOIN budgets b
        ON b.user_id = e.user_id
       AND b.category = e.category

      WHERE e.user_id = $1
        AND ${condition}

      GROUP BY e.category, e.currency, b.amount
      ORDER BY amount DESC
      `,
      paramsBuilder(session.userId),
    );

    return result.rows;
  });
}

const calcChange = (current: number, previous: number) => {
  const amountChange = current - previous;

  if (previous === 0) {
    return {
      amount: amountChange,
      percentage: null,
    };
  }

  const percentageChange = (amountChange / Math.abs(previous)) * 100;

  return {
    amount: amountChange,
    percentage: percentageChange,
  };
};

const getDateFilter = (interval: Interval) => {
  let days: number | null = null;

  switch (interval) {
    case "last_7_days":
      days = 7;
      break;
    case "last_15_days":
      days = 15;
      break;
    case "last_30_days":
      days = 30;
      break;
    case "this_month":
    default:
      days = null;
  }

  const condition =
    days === null
      ? `expense_date >= date_trunc('month', CURRENT_DATE)`
      : `expense_date >= CURRENT_DATE - ($2 * INTERVAL '1 day')`;

  const paramsBuilder = (userId: string) =>
    days === null ? [userId] : [userId, days];

  return { condition, paramsBuilder };
};
