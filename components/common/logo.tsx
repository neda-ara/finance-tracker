"use client";

import { ChartNoAxesCombined, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils/shadcn-utils";
import { Coiny, Baloo_Tamma_2 } from "next/font/google";

const coiny = Coiny({
  weight: ["400"],
});

const bt2 = Baloo_Tamma_2({
  weight: ["400", "500", "600", "700", "800"],
});

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-6">
      <div className="relative bg-white/20 backdrop-blur-sm p-2 rounded-lg">
        <ChartNoAxesCombined className="text-slate-900 w-7 h-7" />
        <DollarSign className="absolute left-4 top-1.25 -rotate-45 h-3 w-3" />
      </div>

      <div className="flex flex-col leading-tight">
        <h1
          className={cn(
            "text-3xl font-semibold tracking-wide leading-5 mt-2",
            coiny.className
          )}
        >
          <span className="text-slate-900">Clari</span>
          <span className="text-white">Fi</span>
        </h1>

        <p
          className={cn(
            "text-sm font-medium text-slate-900/80 leading-4",
            bt2.className
          )}
        >
          Bring clarity to finance
        </p>
      </div>
    </div>
  );
};
