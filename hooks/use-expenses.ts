"use client";

import { createExpense, fetchExpenses } from "@/actions/dashboard/expense";
import { EXPENSE_CLIENT_QUERY_KEY } from "@/lib/constants/query-keys";
import { GetExpensesRequest } from "@/lib/actions/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useExpenses(params: GetExpensesRequest) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      EXPENSE_CLIENT_QUERY_KEY,
      params.page,
      params.pageSize,
      params.searchKey ?? "",
      JSON.stringify(params.filters ?? {}),
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
  };

  return {
    query,
    mutations,
  };
}
