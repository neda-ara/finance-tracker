"use client";

import { createExpense, fetchExpenses } from "@/actions/dashboard/expense";
import { EXPENSE_CLIENT_QUERY_KEY } from "@/lib/constants/query-keys";
import { GetExpensesRequest } from "@/lib/actions/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useExpenses(options: GetExpensesRequest) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      EXPENSE_CLIENT_QUERY_KEY,
      options.page,
      options.pageSize,
      options.searchKey,
      options.filters,
    ],
    queryFn: () => fetchExpenses(options),
  });

  const addMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSE_CLIENT_QUERY_KEY] });
    },
  });

  return {
    ...query,
    expenses: query ?? [],
    addExpense: addMutation,
  };
}
