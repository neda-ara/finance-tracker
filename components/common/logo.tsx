"use client";

import { BarChart3, ChartNoAxesCombined } from "lucide-react";
import { Coiny, Gugi } from "next/font/google";

const coiny = Coiny({
  weight: ["400"],
});

const gugi = Gugi({
  weight: ["400"],
});

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-6">
      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
        <ChartNoAxesCombined className="text-slate-900 w-7 h-7" />
      </div>

      <div className="flex flex-col leading-tight">
        <h1
          className={`${coiny.className} text-3xl font-semibold tracking-wide leading-5 mt-1.5`}
        >
          <span className="text-slate-900">Clari</span>
          <span className="text-white">Fi</span>
        </h1>

        <p className="text-xs font-medium text-slate-900/80 leading-3">
          Bring clarity to finance
        </p>
      </div>
    </div>
  );
};
