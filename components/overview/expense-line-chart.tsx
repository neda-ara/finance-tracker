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

export const ExpenseLineChart = ({
  data,
  isLoading,
}: {
  data: ExpenseTrend[];
  isLoading: boolean;
}) => {
  const currencySymbol = data?.[0]?.currency
    ? getCurrencySymbol(data[0].currency)
    : "";

  return (
    <div className="max-h-full w-full h-full flex items-center gap-x-2 pt-3">
      {isLoading ? (
        <LineChartSkeleton />
      ) : (
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
      )}
    </div>
  );
};

const LineChartSkeleton = () => {
  return (
    <div className="max-h-full w-full h-full flex items-center pt-3 animate-pulse">
      <div className="w-full h-full">
        <div className="w-full h-full bg-gray-50 rounded-sm relative overflow-hidden">
          <div className="absolute left-8 right-4 top-4 bottom-8">
            <div className="absolute left-0 top-0 bottom-0 border-l border-gray-200" />
            <div className="absolute left-0 right-0 bottom-0 border-t border-gray-200" />
            <div className="absolute -left-4 top-0 bottom-0 flex flex-col justify-between">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-2 h-px bg-gray-300/40" />
              ))}
            </div>
            <div className="absolute -bottom-4 left-0 right-0 flex justify-between">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-px h-2 bg-gray-300/40" />
              ))}
            </div>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
            >
              <path
                d="M0,40 C10,20 20,45 30,28 C40,18 50,35 60,25 C70,15 80,30 90,22 C95,20 100,24 100,24"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
