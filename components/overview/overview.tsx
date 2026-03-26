"use client";

import { HandCoins } from "lucide-react";
import { StatCard, Trend } from "./stat-card";
import { TrendDirection, TrendTone } from "@/lib/actions/types";
import { useEffect } from "react";
import { useOverview } from "@/hooks/use-overview";
import toast from "react-hot-toast";

export const Overview = () => {
  const { overviewQuery } = useOverview();

  console.log("QUERY DATA", overviewQuery.data);

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
      icon: <HandCoins className="h-6 w-6 text-(--color-subtext)" />,
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
      icon: <HandCoins className="h-6 w-6 text-(--color-subtext)" />,
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
      icon: <HandCoins className="h-6 w-6 text-(--color-subtext)" />,
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
      icon: <HandCoins className="h-6 w-6 text-(--color-subtext)" />,
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
    <div className="relative flex flex-col gap-y-8">
      <div className="grid grid-cols-4 xl:gap-x-4 xxl:gap-x-5">
        {OVERVIEW_CARDS.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
};
