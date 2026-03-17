"use client";

import {
  CategoryBreakdown,
  ExpenseTrend,
  OverviewData,
} from "@/lib/actions/types";
import {
  fetchCategoryBreakdown,
  fetchExpenseTrend,
  fetchOverview,
} from "@/actions/dashboard/overview";
import { OVERVIEW_CLIENT_QUERY_KEY } from "@/lib/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useOverview(days: number = 30) {
  const overviewQuery = useQuery<OverviewData>({
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY],
    queryFn: async () => {
      const resp = await fetchOverview();

      if (!resp?.ok) {
        throw new Error(resp.error.message ?? "Failed to fetch overview");
      }

      return resp.data;
    },
    placeholderData: (prev) => prev,
  });

  const trendQuery = useQuery<ExpenseTrend[]>({
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY, "trend", days],
    queryFn: async () => {
      const resp = await fetchExpenseTrend(days);

      if (!resp?.ok) {
        throw new Error(resp.error.message ?? "Failed to fetch expense trend");
      }

      return resp.data;
    },
    placeholderData: (prev) => prev,
  });

  const categoryBreakdownQuery = useQuery<CategoryBreakdown[]>({
    queryKey: [OVERVIEW_CLIENT_QUERY_KEY, "categories", days],
    queryFn: async () => {
      const resp = await fetchCategoryBreakdown(days);

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
    trendQuery,
    categoryBreakdownQuery,
  };
}
