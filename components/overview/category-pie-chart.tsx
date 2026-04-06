"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

type DataType = {
  name: string;
  value: number;
  fill: string;
};

export const CategoryPieChart = ({
  data,
}: {
  data: DataType[] | undefined;
}) => {
  return (
    <div className="max-h-full w-full h-full flex items-center gap-x-2 pt-3">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius="100%"
            paddingAngle={3}
            label={false}
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
        </PieChart>
      </ResponsiveContainer>
      <div className="max-h-[calc(100vh-575px)] h-full min-h-0 w-2/3 overflow-y-scroll custom-scrollbar pr-3 mr-1 flex flex-col gap-2 text-xs">
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
              ₹{item.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
