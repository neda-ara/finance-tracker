"use client";

import { getCurrencySymbol } from "@/lib/utils/utils";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";

type ExpenseCategory = {
  name: string;
  value: number;
  fill: string;
  currency: string;
  payload?: { currency: string };
};

interface PieTooltipProps extends TooltipProps<ValueType, NameType> {
  payload?: ExpenseCategory[];
}

const CustomTooltip = ({ active, payload }: PieTooltipProps) => {
  if (active && payload && payload.length) {
    const {
      name,
      value,
      fill,
      payload: original,
    } = payload[0] as ExpenseCategory;

    const formattedAmount = Number(value ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return (
      <div className="bg-white shadow-md rounded-lg px-3 py-2 border border-gray-200 min-w-30">
        <div className="flex items-center gap-x-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: fill }}
          />
          <span className="text-gray-700 font-medium truncate text-xs">
            {name}
          </span>
        </div>
        <div className="text-gray-900 font-semibold text-sm">
          {getCurrencySymbol(original?.currency ?? "") + " " + formattedAmount}
        </div>
      </div>
    );
  }

  return null;
};

export const CategoryPieChart = ({
  data,
  isLoading,
}: {
  data: ExpenseCategory[] | undefined;
  isLoading: boolean;
}) => {
  const totalExpense = data?.reduce((sum, item) => sum + item.value, 0) || 0;

  const currencySymbol = data?.[0]?.currency
    ? getCurrencySymbol(data[0].currency)
    : "";

  return (
    <div className="max-h-full w-full h-full flex items-center gap-x-2 pt-3">
      {isLoading ? (
        <PieChartSkeleton />
      ) : (
        <>
          <ResponsiveContainer width="100%" height="100%" className="max-h-150">
            <PieChart className="focus:outline-none">
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius="100%"
                paddingAngle={3}
                label={false}
                className="cursor-pointer focus:outline-none"
              />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="min-h-[calc(100vh-600px)] flex justify-center items-center  w-2/3">
            <div className="h-full w-full max-h-[calc(100vh-600px)] min-h-0 overflow-y-scroll custom-scrollbar pr-3 mr-1 flex flex-col gap-2 text-xs">
              {data?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="truncate text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-medium whitespace-nowrap">
                    {item.currency && getCurrencySymbol(item.currency)}
                    {Number(item.value).toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
              <div className="mt-1 border-t border-gray-200 sticky bottom-0 bg-gray-50">
                <div className="flex items-center justify-between gap-2 px-2 py-2 rounded-md">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-gray-900 font-semibold whitespace-nowrap">
                    {currencySymbol}
                    {Number(totalExpense).toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PieChartSkeleton = () => {
  return (
    <div className="max-h-full w-full h-full flex items-center gap-x-2 pt-3 animate-pulse">
      <div className="w-full h-full max-h-150 flex items-center justify-center">
        <div className="w-2/5 3xl:w-1/2 aspect-square rounded-full bg-gray-200" />
      </div>
      <div className="min-h-[calc(100vh-600px)] flex justify-center items-center w-2/3">
        <div className="h-full w-full max-h-[calc(100vh-600px)] min-h-0 overflow-hidden pr-2 mr-1 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 w-full">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" />
                <div className="h-3 bg-gray-200 rounded w-24 sm:w-32" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-12 sm:w-16" />
            </div>
          ))}
          <div className="mt-2 border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between py-2">
              <div className="h-3 bg-gray-300 rounded w-12" />
              <div className="h-3 bg-gray-300 rounded w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const COLORS = [
  "#6C5DD3", // Soft Violet
  "#FF6B6B", // Muted Red
  "#4ECDC4", // Soft Teal
  "#3B82F6", // Soft Blue
  "#FFA94D", // Warm Amber
  "#38BDF8", // Cyan
  "#A78BFA", // Lavender
  "#FCA5A5", // Dusty Pink
  "#22C55E", // Soft Green
  "#FBBF24", // Warm Yellow
  "#60A5FA", // Sky Blue
  "#E879F9", // Soft Magenta
  "#34D399", // Mint Green
  "#F87171", // Coral
  "#8B5CF6", // Lilac
  "#84CC16", // Soft Lime (replaces pale gold cluster)
  "#F472B6", // Rose Pink (replaces muted orange overlap)
  "#FB7185", // Soft Rose (distinct from coral/red)
  "#2DD4BF", // Aqua Green (clear from teal/cyan)
  "#C4B5FD", // Light Lavender (softer, less duplicate)
  "#FDE047", // Bright Pastel Yellow (only one strong yellow)
  "#67E8F9", // Light Cyan (distinct from blues)
  "#FDA4AF", // Blush Pink
  "#86EFAC", // Light Green
  "#E9D5FF", // Very Light Purple
];
