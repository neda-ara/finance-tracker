"use client";

import { CircularProgress } from "../common/common";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
} from "@/lib/constants/constants";
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

  return (
    <div
      key={`expense-card-${idx}`}
      className="card p-4 flex flex-col space-y-3"
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
                {amount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          {budget ? (
            <div className="text-xs text-gray-500">
              Used: {totalPercentage?.toFixed(1)}% of total budget of{" "}
              {currencySymbol}{" "}
              {budget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {overspentAmount > 0 && (
                <div className="font-medium text-xs text-red-600">
                  Over budget by {currencySymbol}
                  {overspentAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              )}
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
    </div>
  );
}
