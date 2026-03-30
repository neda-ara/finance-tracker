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

export function useOverview(interval: Interval = "this_month") {
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
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY, "top_expenses", interval],
    queryFn: async () => {
      const resp = await fetchTopExpenses();

      if (!resp?.ok) {
        throw new Error(resp.error.message ?? "Failed to fetch top expenses");
      }

      return resp.data;
    },
    placeholderData: (prev) => prev,
  });

  const expensesTrendQuery = useQuery<ExpenseTrend[]>({
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY, "expenses_trend", interval],
    queryFn: async () => {
      const resp = await fetchExpenseTrend(interval);

      if (!resp?.ok) {
        throw new Error(resp.error.message ?? "Failed to fetch expense trend");
      }

      return resp.data;
    },
    placeholderData: (prev) => prev,
  });

  const categoryBreakdownQuery = useQuery<CategoryBreakdown[]>({
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY, "categories", interval],
    queryFn: async () => {
      const resp = await fetchCategoryBreakdown(interval);

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
