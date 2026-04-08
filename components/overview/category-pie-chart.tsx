"use client";

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
import { getCurrencySymbol } from "@/lib/utils/utils";

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
}: {
  data: ExpenseCategory[] | undefined;
}) => {
  const totalExpense = data?.reduce((sum, item) => sum + item.value, 0) || 0;

  const currencySymbol = data?.[0]?.currency
    ? getCurrencySymbol(data[0].currency)
    : "";

  return (
    <div className="max-h-full w-full h-full flex items-center gap-x-2 pt-3">
      <ResponsiveContainer width="100%" height="100%">
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
      <div className="max-h-[calc(100vh-600px)] h-full min-h-0 w-2/3 overflow-y-scroll custom-scrollbar pr-3 mr-1 flex flex-col justify-center gap-2 text-xs">
        {data?.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
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
  );
};

export const COLORS = [
  "#6C5DD3", // Soft Violet
  "#FF6B6B", // Muted Red
  "#4ECDC4", // Soft Teal
  "#FFA94D", // Warm Amber
  "#3B82F6", // Soft Blue
  "#F59E0B", // Muted Orange
  "#A78BFA", // Lavender
  "#FCA5A5", // Dusty Pink
  "#22C55E", // Soft Green
  "#FBBF24", // Warm Yellow
  "#60A5FA", // Sky Blue
  "#E879F9", // Soft Magenta
  "#34D399", // Mint Green
  "#F87171", // Coral
  "#8B5CF6", // Lilac
  "#FCD34D", // Pale Gold
  "#38BDF8", // Cyan
  "#FB923C", // Soft Orange
  "#A7F3D0", // Light Mint
  "#C084FC", // Pastel Purple
  "#FDE68A", // Soft Yellow
  "#93C5FD", // Powder Blue
  "#F9A8D4", // Light Pink
  "#4ADE80", // Soft Green
  "#FACC15", // Pale Amber
];
