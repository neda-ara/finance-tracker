import { BudgetsGrid } from "@/components/budgets/budget-grid";
import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Budgets",
  description: "Set and Track my budgets",
};

export default function BudgetsPage() {
  return (
    <div className="relative flex flex-col justify-center pt-4 px-6 gap-y-6">
      <PageTitle heading="Budgets" subheading="Stay on top of your spending." />
      <BudgetsGrid />
    </div>
  );
}
