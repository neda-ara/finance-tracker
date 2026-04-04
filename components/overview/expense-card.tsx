"use client";

import { CircularProgress } from "../common/common";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
} from "@/lib/constants/constants";
import { cn } from "@/lib/utils/shadcn-utils";
import { getCurrencySymbol, isStringEqual } from "@/lib/utils/utils";
import Image from "next/image";

export interface ExpenseCardProps {
  idx: number;
  category: string;
  amount: number;
  currency?: string;
  budget?: number | null;
  budgetUsed?: number | null;
  remaining?: number | null;
  totalPercentage?: number;
}

export function ExpenseCard({
  idx,
  category,
  amount,
  currency = "",
  budget,
  totalPercentage,
}: ExpenseCardProps) {
  const expenseCatObj = EXPENSE_CATEGORIES.find((item) =>
    isStringEqual(item.title, category),
  );
  const currencySymbol = getCurrencySymbol(currency);

  const usedPercentage = budget ? (amount / budget) * 100 : 0;
  const donutUsedPercentage = budget ? Math.min(usedPercentage, 100) : 0;
  const remainingPercentage =
    budget && usedPercentage <= 100 ? 100 - usedPercentage : 0;

  const overspentAmount = budget && usedPercentage > 100 ? amount - budget : 0;

  const formattedAmount = amount.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });

  const formattedBudget = budget?.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });

  const formattedOverspent = overspentAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const roundedPercentage = Math.round(Number(totalPercentage));

  return (
    <div
      key={`expense-card-${idx}`}
      className="card p-4 flex flex-col space-y-1.5"
    >
      <div className="flex items-center gap-x-5">
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-4">
            {expenseCatObj && (
              <Image
                alt={expenseCatObj?.title}
                height={100}
                width={100}
                src={`${EXPENSE_CATEGORY_ICONS_BASE_PATH}${expenseCatObj.iconPath}`}
                className="h-10 w-10 object-contain"
              />
            )}
            <div>
              <p className="font-bold text-sm">{category}</p>
              <p className="font-semibold text-sm">
                {currencySymbol}
                {formattedAmount}
              </p>
            </div>
          </div>
          {budget ? (
            <div className="text-xs text-gray-500 mt-1">
              Used{" "}
              <span
                className={cn(
                  "text-accent-foreground font-medium",
                  roundedPercentage >= 100 && "text-red-500",
                )}
              >
                {roundedPercentage}%
              </span>{" "}
              of total budget of{" "}
              <span className="text-accent-foreground font-medium">
                {currencySymbol}
                {formattedBudget}
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              Budget not set for{" "}
              <span className="font-medium">{expenseCatObj?.title}</span>
            </p>
          )}
        </div>
        {budget && (
          <div className="relative">
            <CircularProgress
              usedPercentage={donutUsedPercentage}
              remainingPercentage={remainingPercentage}
              size={60}
            />
          </div>
        )}
      </div>
      {overspentAmount > 0 && (
        <div className="font-medium text-xs text-red-600">
          Over budget by {currencySymbol}
          {formattedOverspent}
        </div>
      )}
    </div>
  );
}

export const ExpenseCardSkeleton = () => {
  return (
    <div className="card p-4 flex flex-col space-y-1.5">
      <div className="flex items-center gap-x-5">
        <div className="flex flex-col gap-y-2 flex-1 min-w-0">
          <div className="flex gap-x-4 items-center">
            <div className="h-10 w-10 rounded bg-gray-300 transition-all animate-pulse shrink-0" />
            <div className="flex flex-col gap-y-2 flex-1">
              <div className="h-3 rounded bg-gray-300 transition-all animate-pulse" />
              <div className="h-3 rounded bg-gray-300 transition-all animate-pulse" />
            </div>
          </div>

          <div className="mt-1 flex items-center gap-x-2 flex-wrap">
            <div className="h-3 w-full rounded bg-gray-300 transition-all animate-pulse" />
          </div>
        </div>

        <div className="relative shrink-0">
          <div className="h-14 w-14 rounded-full border-4 border-gray-200 transition-all animate-pulse" />
          <div className="absolute inset-0 m-1 rounded-full border-4 border-gray-200" />
        </div>
      </div>

      <div className="h-3 w-3/5 rounded bg-gray-300 transition-all animate-pulse" />
    </div>
  );
};
