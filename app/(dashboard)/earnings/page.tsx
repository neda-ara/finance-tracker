import { cn } from "@/lib/utils/shadcn-utils";
import { dashboardContainerStyles } from "@/lib/constants/constants";
import { EarningsGrid } from "@/components/earnings/earning-grid";
import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Earnings",
  description: "Track my earnings",
};

export default function EarningsPage() {
  return (
    <div className={cn(dashboardContainerStyles)}>
      <PageTitle heading="Earnings" subheading="Every earning accounted for." />
      <EarningsGrid />
    </div>
  );
}
