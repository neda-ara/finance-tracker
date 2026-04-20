"use client";

import { GradientButton } from "@/components/common/common";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function InsightsDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <GradientButton buttonText="Generate AI Insights" />
      </SheetTrigger>
      <SheetContent side="right" className="w-100 sm:w-125">
        <SheetHeader>
          <SheetTitle>AI Insights</SheetTitle>
        </SheetHeader>
        <div className="p-4">your content here</div>
      </SheetContent>
    </Sheet>
  );
}
