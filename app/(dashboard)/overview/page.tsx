import { cn } from "@/lib/utils/shadcn-utils";
import { dashboardContainerStyles } from "@/lib/constants/constants";
import { InsightsDrawer } from "@/components/overview/insights-drawer";
import { Overview } from "@/components/overview/overview";
import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
  description: "My Finances Overview",
};

export default function OverviewPage() {
  return (
    <div className={cn(dashboardContainerStyles)}>
      <div className="flex items-center justify-between">
        <PageTitle
          heading="Overview"
          subheading="Get a snapshot of your finances in one glance."
        />
        <InsightsDrawer />
      </div>
      <Overview />
    </div>
  );
}
