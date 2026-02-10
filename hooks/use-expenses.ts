"use client";

import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "@/actions/dashboard/expense";
import { EXPENSE_CLIENT_QUERY_KEY } from "@/lib/constants/query-keys";
import {
  Expense,
  ExpenseSummary,
  GetExpensesRequest,
  PaginatedResult,
} from "@/lib/actions/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useExpenses(params: GetExpensesRequest) {
  const queryClient = useQueryClient();

  const query = useQuery<PaginatedResult<Expense, ExpenseSummary>>({
    queryKey: [
      EXPENSE_CLIENT_QUERY_KEY,
      params.page,
      params.pageSize,
      params.searchKey ?? "",
      {
        description: params.filters.description || "",
        startDate:
          params.filters.startDate instanceof Date
            ? params.filters.startDate.toISOString()
            : params.filters.startDate ?? "",
        endDate:
          params.filters.endDate instanceof Date
            ? params.filters.endDate.toISOString()
            : params.filters.endDate ?? "",
        minAmount: params.filters.minAmount ?? "",
        maxAmount: params.filters.maxAmount ?? "",
        categories: params.filters.categories?.slice().sort() ?? [],
        currencies: params.filters.currencies?.slice().sort() ?? [],
        paymentModes: params.filters.paymentModes?.slice().sort() ?? [],
        satisfactionRatings:
          params.filters.satisfactionRatings?.slice().sort() ?? [],
      },
    ],
    queryFn: async () => {
      const resp = await fetchExpenses(params);
      if (!resp?.ok) {
        throw new Error(resp.error.message);
      }
      return resp.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const mutations = {
    create: useMutation({
      mutationFn: createExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [EXPENSE_CLIENT_QUERY_KEY],
        });
      },
    }),
    update: useMutation({
      mutationFn: updateExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [EXPENSE_CLIENT_QUERY_KEY] });
      },
    }),
    delete: useMutation({
      mutationFn: deleteExpense,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [EXPENSE_CLIENT_QUERY_KEY] });
      },
    }),
  };

  return {
    query,
    mutations,
  };
}
