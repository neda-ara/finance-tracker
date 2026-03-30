"use client";

import { INTERVALS } from "@/lib/constants/constants";
import { LabelValuePair, TrendDirection, TrendTone } from "@/lib/actions/types";
import { Layers, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { StatCard, Trend } from "./stat-card";
import { useEffect, useState } from "react";
import { useOverview } from "@/hooks/use-overview";
import toast from "react-hot-toast";

export const Overview = () => {
  const [topExpensesInterval, setTopExpensesInterval] = useState("this_month");

  const { overviewQuery } = useOverview();

  useEffect(() => {
    if (overviewQuery.error) {
      toast.error(overviewQuery.error?.message);
    }
  }, [overviewQuery.error]);

  const data = overviewQuery.data;

  const getTrend = (
    change?: { amount: number; percentage: number | null },
    contextLabel?: string,
    invert = false,
    noPrevDataText?: string,
  ): Trend | undefined => {
    if (!change || change.percentage === null) {
      return {
        value: "—",
        direction: "neutral",
        tone: "neutral",
        label: noPrevDataText,
      };
    }

    const { amount, percentage } = change;

    const direction: TrendDirection =
      amount > 0 ? "up" : amount < 0 ? "down" : "neutral";

    const tone: TrendTone = invert
      ? amount > 0
        ? "danger"
        : amount < 0
          ? "success"
          : "neutral"
      : amount > 0
        ? "success"
        : amount < 0
          ? "danger"
          : "neutral";

    const formattedAmount = Math.abs(amount).toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    return {
      value: `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`,
      direction,
      tone,
      label: `${amount >= 0 ? "+" : "-"}${formattedAmount} ${contextLabel ?? ""}`,
    };
  };

  const OVERVIEW_CARDS = [
    {
      title: "Earnings (Last 30 Days)",
      amount: data?.earnings.amount ?? 0,
      currency: data?.earnings.currency,
      icon: <TrendingUp className="h-6 w-6 text-(--color-subtext)" />,
      trend: getTrend(
        {
          amount: data?.earnings?.change?.amount ?? 0,
          percentage: data?.earnings?.change?.percentage ?? null,
        },
        "vs previous 30 days",
        false,
        "No data for previous 30 days",
      ),
    },
    {
      title: "Expenses (This Month)",
      amount: data?.expenses.amount ?? 0,
      currency: data?.expenses.currency,
      icon: <Wallet className="h-6 w-6 text-(--color-subtext)" />,
      trend: getTrend(
        {
          amount: data?.expenses?.change?.amount ?? 0,
          percentage: data?.expenses?.change?.percentage ?? null,
        },
        "vs last month",
        true,
        "No data for last month",
      ),
    },
    {
      title: "Current Savings",
      amount: data?.savings.amount ?? 0,
      currency: data?.savings.currency,
      icon: <Layers className="h-6 w-6 text-(--color-subtext)" />,
      trend: getTrend(
        {
          amount: data?.savings?.change?.amount ?? 0,
          percentage: data?.savings?.change?.percentage ?? null,
        },
        "vs last month",
        false,
        "No data for last month",
      ),
    },
    {
      title: "Budget Left (This Month)",
      amount: data?.budget?.remaining ?? 0,
      currency: data?.budget?.currency,
      icon: <PiggyBank className="h-6 w-6 text-(--color-subtext)" />,
      trend: data?.budget
        ? {
            value: `${Math.round(data.budget.usedPercentage)}% used`,
            tone:
              data.budget.usedPercentage > 80
                ? "danger"
                : data.budget.usedPercentage > 60
                  ? "warning"
                  : ("success" as TrendTone),
            label: "of monthly budget",
          }
        : {
            value: "—",
            tone: "neutral" as TrendTone,
            label: "No budget set",
          },
    },
  ];

  return (
    <div className="relative flex flex-1 flex-col gap-y-8">
      <section className="grid grid-cols-4 gap-x-3 xl:gap-x-4 xxl:gap-x-5">
        {OVERVIEW_CARDS.map((card, idx) => (
          <StatCard key={idx} idx={idx} {...card} />
        ))}
      </section>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Top Expenses</h2>
          <Select
            value={topExpensesInterval}
            onValueChange={setTopExpensesInterval}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent position="popper">
              {INTERVALS.map((item: LabelValuePair) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-5 gap-x-3 xl:gap-x-4 xxl:gap-x-5"></div>
      </section>
      <section className="flex flex-col flex-1 min-h-0">
        <h2 className="font-bold text-lg mb-2">Expense Trends</h2>
        <div className="flex-1 grid grid-cols-2 gap-x-3 xl:gap-x-4 xxl:gap-x-5">
          <div className="h-full border"></div>
          <div className="h-full border"></div>
        </div>
      </section>
    </div>
  );
};
