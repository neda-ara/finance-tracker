"use client";

import { CURRENCIES } from "@/lib/constants/constants";
import { KpiCard } from "../common/common";
import { useEffect } from "react";
import { useOverview } from "@/hooks/use-overview";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";

export const Overview = () => {
  const { overviewQuery } = useOverview();

  const data = overviewQuery.data;
  const expenseChange = data?.expensesThisMonth.change ?? 0;

  useEffect(() => {
    if (overviewQuery.error) {
      toast.error(overviewQuery.error?.message);
    }
  }, [overviewQuery.error]);

  const expenseTrendIcon =
    expenseChange > 0 ? (
      <TrendingUp className="text-green-500" />
    ) : (
      <TrendingDown className="text-red-600" />
    );

  //  1. Earned over last 30 days 2. Expenses this month 3. Average daily spending 4. Average Income to expense ratio

  return <div className="relative flex flex-col gap-y-8"></div>;
};
