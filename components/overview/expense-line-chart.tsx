"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { ExpenseTrend } from "@/lib/actions/types";
import { getCurrencySymbol } from "@/lib/utils/utils";

interface LineTooltipProps extends TooltipProps<number, string> {
  label?: string | number;
  payload?: {
    payload: ExpenseTrend;
    value: number;
  }[];
}

const CustomLineTooltip = ({ active, payload, label }: LineTooltipProps) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;

    const formattedAmount = Number(point?.amount ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

    const currencySymbol = point?.currency
      ? getCurrencySymbol(point.currency)
      : "";

    return (
      <div className="bg-white shadow-md rounded-lg px-3 py-2 border border-gray-200 min-w-30">
        <div className="flex items-center gap-x-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#ff7a7d" }}
          />
          <span className="text-gray-700 font-medium truncate text-xs">
            {label}
          </span>
        </div>
        <div className="text-gray-900 font-semibold text-sm">
          {currencySymbol + " " + formattedAmount}
        </div>
      </div>
    );
  }

  return null;
};

export const ExpenseLineChart = ({ data }: { data: ExpenseTrend[] }) => {
  const currencySymbol = data?.[0]?.currency
    ? getCurrencySymbol(data[0].currency)
    : "";

  return (
    <div className="max-h-full w-full h-full flex items-center gap-x-2 pt-3">
      <ResponsiveContainer width="100%" height="100%" className="max-h-150">
        <LineChart data={data}>
          <CartesianGrid
            stroke="#E5E7EB"
            strokeDasharray="4 6"
            vertical={false}
          />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              `${currencySymbol}${Number(value).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}`
            }
          />
          <Tooltip
            content={<CustomLineTooltip />}
            cursor={{ stroke: "#ff7a7d33", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#ff7a7d"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
