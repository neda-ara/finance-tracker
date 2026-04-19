"use client";

import {
  CategoryBreakdown,
  ExpenseTrend,
  Interval,
  OverviewData,
  TopExpensesData,
} from "@/lib/actions/types";
import {
  fetchCategoryBreakdown,
  fetchExpenseTrend,
  fetchOverview,
  fetchTopExpenses,
} from "@/actions/dashboard/overview";
import { OVERVIEW_CLIENT_QUERY_KEY } from "@/lib/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

type OverviewIntervals = {
  topExpenses?: Interval;
  trend?: Interval;
  categories?: Interval;
};

export function useOverview(intervals: OverviewIntervals = {}) {
  const {
    topExpenses = "this_month",
    trend = "this_month",
    categories = "this_month",
  } = intervals;

  const overviewQuery = useQuery<OverviewData>({
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY],
    queryFn: async () => {
      const resp = await fetchOverview();

      if (!resp?.ok) {
        throw new Error(resp.error.message ?? "Failed to fetch overview data");
      }

      return resp.data;
    },
    placeholderData: (prev) => prev,
  });

  const topExpensesQuery = useQuery<TopExpensesData>({
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY, "top_expenses", topExpenses],
    queryFn: async () => {
      const resp = await fetchTopExpenses(topExpenses);

      if (!resp?.ok) {
        throw new Error(resp.error.message ?? "Failed to fetch top expenses");
      }

      return resp.data;
    },
    placeholderData: (prev) => prev,
  });

  const expensesTrendQuery = useQuery<ExpenseTrend[]>({
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY, "expenses_trend", trend],
    queryFn: async () => {
      const resp = await fetchExpenseTrend(trend);

      if (!resp?.ok) {
        throw new Error(resp.error.message ?? "Failed to fetch expense trend");
      }

      return resp.data;
    },
    placeholderData: (prev) => prev,
  });

  const categoryBreakdownQuery = useQuery<CategoryBreakdown[]>({
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY, "categories", categories],
    queryFn: async () => {
      const resp = await fetchCategoryBreakdown(categories);

      if (!resp?.ok) {
        throw new Error(
          resp.error.message ?? "Failed to fetch category breakdown",
        );
      }

      return resp.data;
    },
    placeholderData: (prev) => prev,
  });

  return {
    overviewQuery,
    topExpensesQuery,
    expensesTrendQuery,
    categoryBreakdownQuery,
  };
}
