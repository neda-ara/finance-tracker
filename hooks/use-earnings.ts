"use client";

import {
  createEarning,
  deleteEarning,
  fetchEarnings,
  fetchEarningSummary,
  updateEarning,
} from "@/actions/dashboard/earning";
import { EARNING_CLIENT_QUERY_KEY } from "@/lib/constants/query-keys";
import {
  Earning,
  EarningsFiltersType,
  EarningSummary,
  FetchRequest,
  PaginatedResult,
} from "@/lib/actions/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useEarnings(params: FetchRequest<EarningsFiltersType>) {
  const queryClient = useQueryClient();

  const invalidateEarnings = () => {
    queryClient.invalidateQueries({
      queryKey: [EARNING_CLIENT_QUERY_KEY],
    });
  };

  const invalidateSummary = () => {
    queryClient.invalidateQueries({
      queryKey: [EARNING_CLIENT_QUERY_KEY, "summary"],
    });
  };

  const query = useQuery<PaginatedResult<Earning>>({
    queryKey: [
      EARNING_CLIENT_QUERY_KEY,
      params.page,
      params.pageSize,
      {
        searchQuery: params.filters.searchQuery || "",
        startDate:
          params.filters.startDate instanceof Date
            ? params.filters.startDate.toISOString()
            : (params.filters.startDate ?? ""),
        endDate:
          params.filters.endDate instanceof Date
            ? params.filters.endDate.toISOString()
            : (params.filters.endDate ?? ""),
        minAmount: params.filters.minAmount ?? "",
        maxAmount: params.filters.maxAmount ?? "",
        currencies: params.filters.currencies?.slice().sort() ?? [],
      },
    ],
    queryFn: async () => {
      const resp = await fetchEarnings(params);
      if (!resp?.ok) {
        throw new Error(resp.error.message);
      }
      return resp.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const summaryQuery = useQuery<EarningSummary>({
    queryKey: [EARNING_CLIENT_QUERY_KEY, "summary"],
    queryFn: async () => {
      const resp = await fetchEarningSummary();
      if (!resp?.ok) {
        throw new Error(resp.error.message);
      }
      return resp.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const mutations = {
    create: useMutation({
      mutationFn: createEarning,
      onSuccess: () => {
        invalidateEarnings();
        invalidateSummary();
      },
    }),
    update: useMutation({
      mutationFn: updateEarning,
      onSuccess: () => {
        invalidateEarnings();
        invalidateSummary();
      },
    }),
    delete: useMutation({
      mutationFn: deleteEarning,
      onSuccess: () => {
        invalidateEarnings();
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
