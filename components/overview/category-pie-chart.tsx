"use client";

import {
  Legend,
  LegendPayload,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

export const CategoryPieChart = ({
  data,
}: {
  data:
    | {
        name: string;
        value: number;
        fill: string;
      }[]
    | undefined;
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius="80%"
          paddingAngle={3}
          fill="fill"
          label={false}
          labelLine={false}
        />

        <Tooltip
          formatter={(value: ValueType | undefined) => {
            const num = Number(value ?? 0);
            return new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(num);
          }}
        />

        <Legend
          verticalAlign="bottom"
          align="center"
          layout="horizontal"
          wrapperStyle={{ fontSize: "11px" }}
          formatter={(value: string, entry: LegendPayload) => {
            const amount = entry?.payload?.value;
            return `${value} - ₹${Number(amount).toLocaleString()}`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
