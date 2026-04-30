import { BudgetsGrid } from "@/components/budgets/budget-grid";
import { cn } from "@/lib/utils/shadcn-utils";
import { dashboardContainerStyles } from "@/lib/constants/constants";
import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Budgets",
  description: "Set and Track my budgets",
};

export default function BudgetsPage() {
  return (
    <div className={cn(dashboardContainerStyles)}>
      <PageTitle heading="Budgets" subheading="Stay on top of your spending." />
      <BudgetsGrid />
    </div>
  );
}
