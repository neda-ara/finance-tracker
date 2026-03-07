"use server";

import {
  ActionResult,
  Earning,
  EarningsFiltersType,
  EarningSummary,
  FetchRequest,
  PaginatedResult,
} from "@/lib/actions/types";
import { db } from "@/lib/db";
import { earningInputSchema } from "@/lib/schema/earning-schema";
import { getAuthenticatedSession, safeRunAction } from "@/lib/actions/helpers";
import { VALIDATION } from "@/lib/constants/constants";

export async function fetchEarnings(
  params: FetchRequest<EarningsFiltersType>,
): Promise<ActionResult<PaginatedResult<Earning>>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const pageNo = Math.max(1, params.page ?? 1);
    const pageSize = params.pageSize ?? 25;
    const offset = (pageNo - 1) * pageSize;

    const { whereSQL, values } = buildEarningFilters(
      session.userId,
      params.filters,
    );

    const earningList = await db.query<Earning>(
      `
      SELECT
        id,
        amount::float AS amount,
        currency,
        category,
        source,
        description,
        received_date AS "receivedDate",
        created_at AS "createdAt"
      FROM earnings
      ${whereSQL}
      ORDER BY received_date DESC, created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
      `,
      values,
    );

    const countRes = await db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM earnings ${whereSQL}`,
      values,
    );

    const totalRecords = Number(countRes.rows[0]?.count ?? 0);

    return {
      data: earningList.rows,
      pageNo,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  });
}

export async function fetchEarningSummary(): Promise<
  ActionResult<EarningSummary>
> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();
    const userId = session.userId;

    const thisMonth = await db.query<{ currency: string; total: number }>(
      `
    SELECT currency, SUM(amount)::float AS total
    FROM earnings
    WHERE user_id = $1
      AND received_date >= date_trunc('month', CURRENT_DATE)
    GROUP BY currency
    ORDER BY total DESC
    LIMIT 1
    `,
      [userId],
    );

    const pastYear = await db.query<{ currency: string; total: number }>(
      `
    SELECT currency, SUM(amount)::float AS total
    FROM earnings
    WHERE user_id = $1
      AND received_date >= CURRENT_DATE - INTERVAL '365 days'
    GROUP BY currency
    ORDER BY total DESC
    LIMIT 1
    `,
      [userId],
    );

    return {
      earnedThisMonth: thisMonth.rows[0] && {
        currency: thisMonth.rows[0].currency,
        amount: thisMonth.rows[0].total,
      },
      earnedPastYear: pastYear.rows[0] && {
        currency: pastYear.rows[0].currency,
        amount: pastYear.rows[0].total,
      },
    };
  });
}

export async function createEarning(
  formData: FormData,
): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const input = {
      amount: Number(formData.get("amount")),
      currency: formData.get("currency"),
      category: formData.get("category"),
      source: formData.get("source"),
      description: formData.get("description"),
      receivedDate: formData.get("receivedDate"),
    };

    const parsedInput = earningInputSchema.safeParse(input);

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
      INSERT INTO earnings (
      user_id,
      amount,
      received_date,
      category,
      currency,
      source,
      description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        session?.userId,
        values.amount,
        values.receivedDate,
        values.category,
        values.currency,
        values.source,
        values.description,
      ],
    );
  });
}

export async function updateEarning(
  formData: FormData,
): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const earningId = formData.get("id");

    if (!earningId) {
      throw { message: "Earning ID is missing" };
    }

    const input = {
      amount: Number(formData.get("amount")),
      currency: formData.get("currency"),
      category: formData.get("category"),
      source: formData.get("source"),
      description: formData.get("description"),
      receivedDate: formData.get("receivedDate"),
    };

    const parsedInput = earningInputSchema.safeParse(input);

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
    UPDATE earnings
    SET
      amount = $1,
      received_date = $2,
      category = $3,
      currency = $4,
      source = $5,
      description = $6,
    WHERE id = $7 AND user_id = $8
    `,
      [
        values.amount,
        values.receivedDate,
        values.category,
        values.currency,
        values.source,
        values.description,
        earningId,
        session?.userId,
      ],
    );

    if (result.rowCount === 0) {
      throw { message: "Requested earning not found" };
    }
  });
}

export async function deleteEarning(
  earningId: string,
): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    if (!earningId) {
      throw { message: "Earning ID is missing" };
    }

    const result = await db.query(
      `
      DELETE FROM earnings
      WHERE id = $1 AND user_id = $2
      `,
      [earningId, session?.userId],
    );

    if (result.rowCount === 0) {
      throw { message: "Requested earning not found" };
    }
  });
}

function buildEarningFilters(userId: string, filters: EarningsFiltersType) {
  const conditions: string[] = ["user_id = $1"];
  const values: unknown[] = [userId];

  if (filters.searchQuery?.trim()) {
    values.push(`%${filters.searchQuery.trim()}%`);
    conditions.push(`
    (
      description ILIKE $${values.length}
      OR source ILIKE $${values.length}
      OR category ILIKE $${values.length}
    )
  `);
  }

  if (filters.startDate) {
    values.push(filters.startDate);
    conditions.push(`received_date >= $${values.length}`);
  }

  if (filters.endDate) {
    values.push(filters.endDate);
    conditions.push(`received_date <= $${values.length}`);
  }

  if (filters.minAmount != null && filters.minAmount != 0) {
    values.push(filters.minAmount);
    conditions.push(`amount >= $${values.length}`);
  }

  if (
    filters.maxAmount != null &&
    filters.maxAmount != Math.ceil(VALIDATION.EARNING.MAX_AMOUNT_LIMIT) / 2
  ) {
    values.push(filters.maxAmount);
    conditions.push(`amount <= $${values.length}`);
  }

  if (filters.currencies?.length) {
    values.push(filters.currencies);
    conditions.push(`currency = ANY($${values.length})`);
  }

  return {
    whereSQL: `WHERE ${conditions.join(" AND ")}`,
    values,
  };
}
