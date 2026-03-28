"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { CURRENCIES } from "@/lib/constants/constants";
import { TrendDirection, TrendTone } from "@/lib/actions/types";

export type Trend = {
  value?: string | number;
  direction?: TrendDirection;
  label?: string;
  tone?: TrendTone;
};

type StatCardProps = {
  idx: number;
  title: string;
  amount: number | string;
  currency?: string;
  icon?: React.ReactNode;
  trend?: Trend;
  formatAmount?: (value: number | string) => string;
};

export function StatCard({
  idx,
  title,
  amount,
  currency = "",
  icon,
  trend,
  formatAmount,
}: StatCardProps) {
  const formattedAmount = formatAmount
    ? formatAmount(amount)
    : amount.toLocaleString();

  const toneStyles = {
    success: "bg-emerald-500/10 text-emerald-600",
    danger: "bg-rose-500/10 text-rose-600",
    warning: "bg-amber-500/10 text-amber-600",
    neutral: "bg-muted text-muted-foreground",
  };

  const directionIcon = {
    up: <ArrowUp className="h-3.5 w-3.5" />,
    down: <ArrowDown className="h-3.5 w-3.5" />,
    neutral: null,
  };

  const currencySymbol =
    CURRENCIES[currency as keyof typeof CURRENCIES]?.symbol;

  return (
    <div key={`stat-card-${idx}`} className="card p-4 space-y-3">
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex flex-col gap-y-2">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-lg font-bold tracking-wide leading-none">
            {currency && <span className="mr-1">{currencySymbol}</span>}
            {formattedAmount}
          </p>
        </div>

        {icon && (
          <div className="flex h-10.5 w-10.5 items-center justify-center rounded-md bg-(--color-subtext)/20">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-x-1">
          {trend.value && (
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium leading-none ${
                toneStyles[trend.tone || "neutral"]
              }`}
            >
              {trend.direction && directionIcon[trend.direction]}
              {trend.value?.toLocaleString()}
            </span>
          )}
          {trend.label && (
            <p className="text-xs text-muted-foreground leading-none">
              {trend.label}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
