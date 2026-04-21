"use client";

import { useState } from "react";
import { GradientButton } from "@/components/common/common";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAiInsights } from "@/hooks/use-insights";

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
        <SheetHeader>
          <SheetTitle>AI Insights</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          {isFetching && !data && (
            <div className="text-sm text-muted-foreground">
              Generating insights...
            </div>
          )}

          {data && (
            <div className="space-y-6 text-sm leading-relaxed">
              <div>
                <h3 className="font-medium mb-2">AI Insights</h3>
                <div className="whitespace-pre-wrap text-muted-foreground">
                  {data.insights}
                </div>
              </div>
            </div>
          )}

          {!isFetching && !data && (
            <div className="text-sm text-muted-foreground">
              Open the panel to generate AI insights.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
