"use client";

import { generateAiInsights } from "@/actions/ai/generate-insights";
import { INSIGHTS_CLIENT_QUERY_KEY } from "@/lib/constants/query-keys";
import { Interval } from "@/lib/actions/types";
import { useQuery } from "@tanstack/react-query";

export function useAiInsights(interval: Interval, enabled = false) {
  return useQuery({
    queryKey: [INSIGHTS_CLIENT_QUERY_KEY, interval],
    queryFn: async () => {
      const resp = await generateAiInsights(interval);
      return resp;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
