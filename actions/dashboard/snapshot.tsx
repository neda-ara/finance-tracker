"use server";

import { db } from "@/lib/db";
import { getAuthenticatedSession, safeRunAction } from "@/lib/actions/helpers";
import { Interval } from "@/lib/actions/types";

export async function fetchSnapshot(interval: Interval) {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();
    const userId = session.userId;

    const earningsRes = await db.query(
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

    const expensesRes = await db.query(
      `
      SELECT currency, SUM(amount)::float AS amount
      FROM expenses
      WHERE user_id = $1
        AND expense_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY currency
      ORDER BY amount DESC
      LIMIT 1
      `,
      [userId],
    );

    const primaryCurrency =
      expensesRes.rows[0]?.currency || earningsRes.rows[0]?.currency || "INR";

    const totalEarned = earningsRes.rows[0]?.amount ?? 0;
    const totalSpent = expensesRes.rows[0]?.amount ?? 0;
    const savings = totalEarned - totalSpent;

    const categoriesRes = await db.query(
      `
      SELECT category, currency, SUM(amount)::float AS amount
      FROM expenses
      WHERE user_id = $1
      GROUP BY category, currency
      ORDER BY amount DESC
      `,
      [userId],
    );

    const categories = categoriesRes.rows
      .filter((c) => c.currency === primaryCurrency)
      .map((c) => ({
        name: c.category,
        amount: c.amount,
        currency: c.currency,
      }));

    const categoryTotal = categories.reduce((a, b) => a + b.amount, 0);

    const categoriesWithPct = categories.map((c) => ({
      ...c,
      percentage: categoryTotal ? (c.amount / categoryTotal) * 100 : 0,
    }));

    const trendRes = await db.query(
      `
      SELECT expense_date::date AS date, currency, SUM(amount)::float AS amount
      FROM expenses
      WHERE user_id = $1
      GROUP BY expense_date, currency
      ORDER BY expense_date
      `,
      [userId],
    );

    const trend = trendRes.rows
      .filter((t) => t.currency === primaryCurrency)
      .map((t) => ({
        date: t.date,
        amount: t.amount,
        currency: t.currency,
      }));

    const avg =
      trend.length > 0
        ? trend.reduce((a, b) => a + b.amount, 0) / trend.length
        : 0;

    const spikes = trend
      .filter((t) => t.amount > avg * 2)
      .map((t) => ({
        date: t.date,
        amount: t.amount,
        baseline: avg,
        multiplier: avg ? t.amount / avg : 0,
        currency: primaryCurrency,
      }));

    const budgetRes = await db.query(
      `
      SELECT COALESCE(SUM(amount), 0)::float AS total
      FROM budgets
      WHERE user_id = $1
        AND currency = $2
      `,
      [userId, primaryCurrency],
    );

    const budgetTotal = budgetRes.rows[0]?.total ?? 0;

    return {
      period: interval,
      currency: primaryCurrency,
      overview: {
        earnings: { amount: totalEarned, currency: primaryCurrency },
        expenses: { amount: totalSpent, currency: primaryCurrency },
        savings: { amount: savings, currency: primaryCurrency },
        savingsRate: totalEarned ? savings / totalEarned : 0,
      },
      trends: {
        currency: primaryCurrency,
        daily: trend,
        average: avg,
      },
      categories: categoriesWithPct,
      budget: {
        total: budgetTotal,
        spent: totalSpent,
        remaining: budgetTotal - totalSpent,
        usagePercent: budgetTotal ? (totalSpent / budgetTotal) * 100 : 0,
        currency: primaryCurrency,
      },
      spikes,
    };
  });
}
