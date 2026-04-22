"use client";

import { GradientButton } from "@/components/common/common";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAiInsights } from "@/hooks/use-insights";
import { useState } from "react";
import { Wand } from "lucide-react";

export function InsightsDrawer() {
  const [open, setOpen] = useState(false);

  const { data, isFetching, refetch } = useAiInsights("this_month", false);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value && !data) {
      refetch();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <GradientButton buttonText="Generate AI Insights" />
      </SheetTrigger>

      <SheetContent side="right" className="w-105 sm:w-130 flex flex-col">
        <SheetHeader className="pb-1 ">
          <SheetTitle>
            <div className="flex items-center gap-x-1">
              AI Insights <Wand />
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 flex-1 overflow-hidden">
          {isFetching && !data && (
            <div className="flex flex-col gap-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`loader-${i}`}
                  className="w-full bg-gray-200 animate-pulse h-7 rounded-md transition-all"
                />
              ))}
            </div>
          )}
          {data && (
            <div className="h-full overflow-y-auto custom-scrollbar pr-1 space-y-6 pb-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Observations</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  {data?.insights?.observations.map(
                    (item: string, i: number) => (
                      <li
                        key={i}
                        className="text-xs text-accent-foreground leading-relaxed"
                      >
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3">Suggestions</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  {data?.insights?.suggestions.map(
                    (item: string, i: number) => (
                      <li
                        key={i}
                        className="text-xs text-accent-foreground leading-relaxed"
                      >
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          )}
          {!isFetching && !data?.insights && (
            <div className="bg-red-100 p-2.5 rounded-md">
              <p className="text-[13px] text-red-600 font-medium">
                An unexpected error occurred while fetching AI insights. Please
                try again later.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
