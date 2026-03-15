"use client";

import { BUDGET_CLIENT_QUERY_KEY } from "@/lib/constants/query-keys";
import {
  Budget,
  BudgetSummary,
  BaseFetchRequest,
  PaginatedResult,
} from "@/lib/actions/types";
import {
  createBudget,
  deleteBudget,
  fetchBudgets,
  fetchBudgetSummary,
  updateBudget,
} from "@/actions/dashboard/budget";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useBudgets(params: BaseFetchRequest) {
  const queryClient = useQueryClient();

  const invalidateBudgets = () => {
    queryClient.invalidateQueries({
      queryKey: [BUDGET_CLIENT_QUERY_KEY],
    });
  };

  const invalidateSummary = () => {
    queryClient.invalidateQueries({
      queryKey: [BUDGET_CLIENT_QUERY_KEY, "summary"],
    });
  };

  const query = useQuery<PaginatedResult<Budget>>({
    queryKey: [BUDGET_CLIENT_QUERY_KEY, params.page, params.pageSize],
    queryFn: async () => {
      const resp = await fetchBudgets(params);
      if (!resp?.ok) {
        throw new Error(resp.error.message ?? "Failed to fetch budgets");
      }
      return resp.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const summaryQuery = useQuery<BudgetSummary>({
    queryKey: [BUDGET_CLIENT_QUERY_KEY, "summary"],
    queryFn: async () => {
      const resp = await fetchBudgetSummary();
      if (!resp?.ok) {
        throw new Error(resp.error.message ?? "Failed to fetch budget summary");
      }
      return resp.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const mutations = {
    create: useMutation({
      mutationFn: createBudget,
      onSuccess: () => {
        invalidateBudgets();
        invalidateSummary();
      },
    }),
    update: useMutation({
      mutationFn: updateBudget,
      onSuccess: () => {
        invalidateBudgets();
        invalidateSummary();
      },
    }),
    delete: useMutation({
      mutationFn: deleteBudget,
      onSuccess: () => {
        invalidateBudgets();
        invalidateSummary();
      },
    }),
  };

  return {
    query,
    summaryQuery,
    mutations,
  };
}
